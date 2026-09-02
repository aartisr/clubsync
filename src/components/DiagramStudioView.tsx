import React, { useState, useRef } from 'react';
import { DIAGRAM_SPECS } from '../data/diagramsData';
import { DiagramNode, DiagramEdge, SchoolConfig, DiagramZone } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Info, 
  CheckCircle2, 
  Sparkles,
  Bot,
  Layers,
  Key,
  ShieldCheck,
  Cpu,
  User,
  Lock,
  Printer,
  FileText,
  Check,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  SlidersHorizontal,
  Table,
  Presentation,
  Shield
} from 'lucide-react';

interface DiagramStudioViewProps {
  config: SchoolConfig;
  onOpenAI: () => void;
}

type ViewMode = 'canvas' | 'presentation' | 'sequence-table';

export const DiagramStudioView: React.FC<DiagramStudioViewProps> = ({ config, onOpenAI }) => {
  const [activeDiagramId, setActiveDiagramId] = useState<string>(DIAGRAM_SPECS[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>('canvas');
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isWalkthroughPlaying, setIsWalkthroughPlaying] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showZoneBoundaries, setShowZoneBoundaries] = useState<boolean>(true);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const canvasRef = useRef<SVGSVGElement | null>(null);

  const activeDiagram = DIAGRAM_SPECS.find(d => d.id === activeDiagramId) || DIAGRAM_SPECS[0];
  const currentStep = activeDiagram.walkthroughSteps[activeStepIndex];

  const canvasWidth = activeDiagram.canvasWidth || 1200;
  const canvasHeight = activeDiagram.canvasHeight || 580;

  // Auto-advance walkthrough steps when playing
  React.useEffect(() => {
    let interval: any;
    if (isWalkthroughPlaying) {
      interval = setInterval(() => {
        setActiveStepIndex(prev => {
          if (prev >= activeDiagram.walkthroughSteps.length - 1) {
            setIsWalkthroughPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 3800);
    }
    return () => clearInterval(interval);
  }, [isWalkthroughPlaying, activeDiagram]);

  // Reset step index when changing diagrams
  const handleSelectDiagram = (id: string) => {
    setActiveDiagramId(id);
    setSelectedNode(null);
    setHoveredNodeId(null);
    setActiveStepIndex(0);
    setIsWalkthroughPlaying(false);
  };

  // Node connectedness check
  const isNodeConnectedToActive = (nodeId: string) => {
    if (!hoveredNodeId && !selectedNode) return true;
    const targetId = hoveredNodeId || selectedNode?.id;
    if (nodeId === targetId) return true;
    return activeDiagram.edges.some(
      e => (e.from === targetId && e.to === nodeId) || (e.to === targetId && e.from === nodeId)
    );
  };

  const isNodeHighlighted = (nodeId: string) => {
    if (selectedNode?.id === nodeId) return true;
    if (hoveredNodeId === nodeId) return true;
    if (currentStep?.highlightNodes.includes(nodeId)) return true;
    return false;
  };

  const isEdgeHighlighted = (edge: DiagramEdge) => {
    if (currentStep?.highlightEdges.includes(edge.id)) return true;
    if (hoveredNodeId && (edge.from === hoveredNodeId || edge.to === hoveredNodeId)) return true;
    if (selectedNode && (edge.from === selectedNode.id || edge.to === selectedNode.id)) return true;
    return false;
  };

  // Icon selector helper
  const getNodeIcon = (iconName?: string, type?: string) => {
    switch (iconName || type) {
      case 'ShieldCheck':
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'Cpu':
      case 'process':
        return <Cpu className="w-4 h-4 text-purple-600" />;
      case 'User':
      case 'user':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'Bot':
      case 'group':
        return <Bot className="w-4 h-4 text-amber-600" />;
      case 'Layers':
      case 'github-team':
      case 'repo':
        return <Layers className="w-4 h-4 text-teal-600" />;
      case 'Lock':
        return <Lock className="w-4 h-4 text-rose-600" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-slate-600" />;
    }
  };

  // Smart Port Connection & Bezier Curve Calculator
  // Prevents edges from cutting through node bodies
  const calculateEdgePath = (edge: DiagramEdge) => {
    const fromNode = activeDiagram.nodes.find(n => n.id === edge.from);
    const toNode = activeDiagram.nodes.find(n => n.id === edge.to);
    if (!fromNode || !toNode) return null;

    const w1 = fromNode.width || 240;
    const h1 = fromNode.height || 90;
    const w2 = toNode.width || 240;
    const h2 = toNode.height || 90;

    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;

    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    let cx1 = 0;
    let cy1 = 0;
    let cx2 = 0;
    let cy2 = 0;
    let midX = 0;
    let midY = 0;

    if (edge.routing === 'vertical') {
      if (dy >= 0) {
        // Top to Bottom
        x1 = fromNode.x + w1 / 2;
        y1 = fromNode.y + h1;
        x2 = toNode.x + w2 / 2;
        y2 = toNode.y;
        const curveDist = Math.max(30, Math.abs(y2 - y1) * 0.45);
        cx1 = x1;
        cy1 = y1 + curveDist;
        cx2 = x2;
        cy2 = y2 - curveDist;
      } else {
        // Bottom to Top
        x1 = fromNode.x + w1 / 2;
        y1 = fromNode.y;
        x2 = toNode.x + w2 / 2;
        y2 = toNode.y + h2;
        const curveDist = Math.max(30, Math.abs(y1 - y2) * 0.45);
        cx1 = x1;
        cy1 = y1 - curveDist;
        cx2 = x2;
        cy2 = y2 + curveDist;
      }
      midX = (x1 + x2) / 2;
      midY = (y1 + y2) / 2;
    } else if (edge.routing === 'curved' || edge.routing === 'return') {
      // Curved diagonal or feedback
      if (dx >= 0) {
        x1 = fromNode.x + w1;
        y1 = fromNode.y + h1 / 2;
        x2 = toNode.x;
        y2 = toNode.y + h2 / 2;
        cx1 = x1 + Math.max(50, dx * 0.5);
        cy1 = y1;
        cx2 = x2 - Math.max(50, dx * 0.5);
        cy2 = y2;
      } else {
        // Backward return loop (e.g. GitHub SP back to User)
        x1 = fromNode.x + w1 / 2;
        y1 = fromNode.y + h1;
        x2 = toNode.x + w2 / 2;
        y2 = toNode.y + h2;
        const dip = 60;
        cx1 = x1;
        cy1 = y1 + dip;
        cx2 = x2;
        cy2 = y2 + dip;
      }
      midX = (x1 + x2) / 2;
      midY = (y1 + y2) / 2;
    } else {
      // Standard Horizontal (Left to Right)
      if (dx >= -50) {
        x1 = fromNode.x + w1;
        y1 = fromNode.y + h1 / 2;
        x2 = toNode.x;
        y2 = toNode.y + h2 / 2;
        const span = Math.max(30, Math.abs(x2 - x1) * 0.45);
        cx1 = x1 + span;
        cy1 = y1;
        cx2 = x2 - span;
        cy2 = y2;
      } else {
        // Fallback
        x1 = fromNode.x;
        y1 = fromNode.y + h1 / 2;
        x2 = toNode.x + w2;
        y2 = toNode.y + h2 / 2;
        const span = Math.max(30, Math.abs(x1 - x2) * 0.45);
        cx1 = x1 - span;
        cy1 = y1;
        cx2 = x2 + span;
        cy2 = y2;
      }
      midX = (x1 + x2) / 2;
      midY = (y1 + y2) / 2;
    }

    // Apply optional custom label offset
    if (edge.labelOffset) {
      midX += edge.labelOffset.x || 0;
      midY += edge.labelOffset.y || 0;
    }

    const pathString = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
    return { pathString, x1, y1, x2, y2, midX, midY };
  };

  const handleExportSVG = () => {
    const svgElement = document.getElementById('diagram-canvas-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.schoolName.toLowerCase().replace(/\s+/g, '-')}-${activeDiagram.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    if (!activeDiagram.executiveBrief) return;
    const text = `
PCSS II ARCHITECTURE BRIEF: ${activeDiagram.title.toUpperCase()}
Domain: @${config.domain}
School: ${config.schoolName}

EXECUTIVE OVERVIEW:
${activeDiagram.executiveBrief.overview}

MANAGEMENT BENEFITS:
${activeDiagram.executiveBrief.managementBenefits.map(b => `• ${b}`).join('\n')}

GOVERNANCE & FERPA CHECKS:
${activeDiagram.executiveBrief.governanceChecks.map(g => `✓ ${g}`).join('\n')}

DECISION IMPACT:
${activeDiagram.executiveBrief.decisionImpact}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Studio Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-900 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="bg-blue-700 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest">
              Executive Architecture Studio
            </span>
            <span className="text-xs text-slate-600 font-mono font-bold uppercase">
              {config.schoolName} • @{config.domain}
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 uppercase tracking-wider">
              Management Approved Specs
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-slate-900">
            {activeDiagram.title}
          </h1>
          <p className="text-slate-600 font-medium text-xs sm:text-sm mt-1 max-w-3xl">
            {activeDiagram.subtitle}
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 border border-slate-300">
            <button
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewMode === 'canvas'
                  ? 'bg-white text-blue-800 shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Visual Blueprint</span>
            </button>
            <button
              onClick={() => setViewMode('presentation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewMode === 'presentation'
                  ? 'bg-white text-blue-800 shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Boardroom Slides</span>
            </button>
            <button
              onClick={() => setViewMode('sequence-table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewMode === 'sequence-table'
                  ? 'bg-white text-blue-800 shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Protocol Matrix</span>
            </button>
          </div>

          <button
            onClick={handleExportSVG}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
            title="Export high-resolution vector SVG"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export SVG</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
            title="Print executive sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-700 hover:bg-blue-600 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>AI Explainer</span>
          </button>
        </div>
      </header>

      {/* Diagram Selection Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        {DIAGRAM_SPECS.map(d => {
          const isActive = activeDiagramId === d.id;
          return (
            <button
              key={d.id}
              onClick={() => handleSelectDiagram(d.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-2 ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500 hover:bg-slate-50'
              }`}
            >
              <span>{d.title.split('&')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 30-Second Management Sign-off Banner */}
      {activeDiagram.executiveBrief && (
        <div className="bg-white border-2 border-slate-900 p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Executive Leadership Briefing: {activeDiagram.title}
              </span>
            </div>
            <button
              onClick={handleCopySummary}
              className="text-[11px] font-bold uppercase tracking-wider text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>Copy Briefing For Board</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-3 border border-slate-200">
              <span className="font-mono font-bold text-slate-900 text-[11px] uppercase block mb-1">
                Zero Cost & Overhead
              </span>
              <p className="text-slate-600 leading-relaxed">
                {activeDiagram.executiveBrief.managementBenefits[0]}
              </p>
            </div>
            <div className="bg-slate-50 p-3 border border-slate-200">
              <span className="font-mono font-bold text-slate-900 text-[11px] uppercase block mb-1">
                FERPA & Student Privacy
              </span>
              <p className="text-slate-600 leading-relaxed">
                {activeDiagram.executiveBrief.governanceChecks[0]}
              </p>
            </div>
            <div className="bg-slate-50 p-3 border border-slate-200">
              <span className="font-mono font-bold text-slate-900 text-[11px] uppercase block mb-1">
                Institutional Continuity
              </span>
              <p className="text-slate-600 leading-relaxed">
                {activeDiagram.executiveBrief.decisionImpact}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guided Walkthrough Player Controls */}
      {activeDiagram.walkthroughSteps.length > 0 && viewMode === 'canvas' && (
        <div className="bg-slate-900 text-white p-4 shadow-md border-2 border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsWalkthroughPlaying(!isWalkthroughPlaying)}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white transition-colors shrink-0 shadow-xs"
              title={isWalkthroughPlaying ? 'Pause Walkthrough' : 'Play Animated Walkthrough'}
            >
              {isWalkthroughPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-950/80 px-1.5 py-0.5 border border-blue-800">
                  Step {activeStepIndex + 1} of {activeDiagram.walkthroughSteps.length}
                </span>
                <span className="text-xs font-black uppercase text-white tracking-wide">
                  {currentStep?.title}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {currentStep?.description}
              </p>
              {currentStep?.managementRationale && (
                <p className="text-[11px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Executive Note: {currentStep.managementRationale}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
              disabled={activeStepIndex === 0}
              className="p-2 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-400 px-2">
              {activeStepIndex + 1}/{activeDiagram.walkthroughSteps.length}
            </span>
            <button
              onClick={() => setActiveStepIndex(prev => Math.min(activeDiagram.walkthroughSteps.length - 1, prev + 1))}
              disabled={activeStepIndex === activeDiagram.walkthroughSteps.length - 1}
              className="p-2 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setActiveStepIndex(0); setIsWalkthroughPlaying(false); }}
              className="p-2 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Reset Walkthrough"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW MODE 1: VISUAL ARCHITECTURE CANVAS                    */}
      {/* ========================================================= */}
      {viewMode === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* SVG Interactive Canvas */}
          <div className="lg:col-span-3 bg-white border-2 border-slate-900 p-4 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[580px]">
            
            {/* Canvas Toolbar */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1 border border-slate-300 shadow-xs">
              <button
                onClick={() => setShowZoneBoundaries(!showZoneBoundaries)}
                className={`px-2 py-1 text-[11px] font-bold uppercase transition-colors ${
                  showZoneBoundaries ? 'bg-blue-100 text-blue-900 font-black' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Toggle Architectural Swimlane Enclosures"
              >
                Zones: {showZoneBoundaries ? 'ON' : 'OFF'}
              </button>
              <div className="h-4 w-px bg-slate-300 mx-1" />
              <button
                onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                className="p-1 text-slate-700 hover:bg-slate-100"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-600 px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
                className="p-1 text-slate-700 hover:bg-slate-100"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="px-2 py-1 text-[10px] uppercase font-bold text-slate-600 hover:text-slate-900 border-l border-slate-200"
              >
                Reset
              </button>
            </div>

            {/* SVG Canvas Container */}
            <div 
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
              className="w-full transition-transform duration-200 overflow-visible py-4"
            >
              <svg
                id="diagram-canvas-svg"
                ref={canvasRef}
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                className="w-full h-auto overflow-visible select-none"
              >
                <defs>
                  {/* Subtle Blueprint Dot Grid */}
                  <pattern id="dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" className="fill-slate-200" />
                  </pattern>

                  {/* Directional Arrowheads */}
                  <marker
                    id="arrow-default"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 9 5 L 0 9 z" className="fill-slate-400" />
                  </marker>

                  <marker
                    id="arrow-active"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 9 5 L 0 9 z" className="fill-amber-500" />
                  </marker>

                  <marker
                    id="arrow-primary"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 9 5 L 0 9 z" className="fill-blue-600" />
                  </marker>

                  {/* Soft Drop Shadow Filter for Cards */}
                  <filter id="card-shadow" x="-5%" y="-5%" width="115%" height="115%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.08" />
                  </filter>
                  <filter id="active-glow" x="-10%" y="-10%" width="125%" height="125%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.45" />
                  </filter>
                </defs>

                {/* Background Grid */}
                <rect width={canvasWidth} height={canvasHeight} fill="url(#dot-grid)" />

                {/* 1. Render Architectural Swimlanes / Container Zones */}
                {showZoneBoundaries && activeDiagram.zones?.map(zone => {
                  return (
                    <g key={zone.id} className="transition-opacity duration-300">
                      {/* Zone Boundary Rectangle */}
                      <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.width}
                        height={zone.height}
                        rx={10}
                        className="fill-slate-50/60 stroke-slate-300 stroke-1 stroke-dasharray-[4]"
                      />

                      {/* Zone Header Bar */}
                      <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.width}
                        height={30}
                        rx={8}
                        className="fill-slate-100 stroke-slate-300 stroke-1"
                      />

                      {/* Zone Header Title */}
                      <text
                        x={zone.x + 12}
                        y={zone.y + 19}
                        className="text-[11px] font-black uppercase tracking-wider fill-slate-800 font-mono"
                      >
                        {zone.label}
                      </text>

                      {/* Zone Badge */}
                      {zone.badge && (
                        <text
                          x={zone.x + zone.width - 12}
                          y={zone.y + 19}
                          textAnchor="end"
                          className="text-[10px] font-mono font-bold fill-slate-500 uppercase"
                        >
                          {zone.badge}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* 2. Render Curved / Orthogonal Connectors (Edges) */}
                {activeDiagram.edges.map(edge => {
                  const edgeGeometry = calculateEdgePath(edge);
                  if (!edgeGeometry) return null;

                  const { pathString, midX, midY } = edgeGeometry;
                  const isHighlighted = isEdgeHighlighted(edge);
                  const isDimmed = (hoveredNodeId || selectedNode) && !isHighlighted;

                  return (
                    <g 
                      key={edge.id}
                      className={`transition-opacity duration-300 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
                    >
                      {/* Interactive Wide Path for Easy Hover */}
                      <path
                        d={pathString}
                        fill="none"
                        stroke="transparent"
                        strokeWidth={18}
                        className="cursor-pointer"
                      />

                      {/* Visible Curved Connector Line */}
                      <path
                        d={pathString}
                        fill="none"
                        className={`transition-all duration-300 ${
                          isHighlighted
                            ? 'stroke-amber-500 stroke-[3px] stroke-dasharray-[6] animate-pulse'
                            : 'stroke-slate-400 stroke-[2px]'
                        }`}
                        markerEnd={isHighlighted ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                      />

                      {/* Non-Colliding Edge Label Pill */}
                      {edge.label && (
                        <g transform={`translate(${midX}, ${midY})`} className="cursor-pointer">
                          {/* Label Pill Background */}
                          <rect
                            x={-(edge.label.length * 3.5 + 16)}
                            y={-12}
                            width={edge.label.length * 7 + 32}
                            height={24}
                            rx={12}
                            className={`transition-all ${
                              isHighlighted
                                ? 'fill-amber-50 stroke-amber-500 stroke-2'
                                : 'fill-white stroke-slate-300 stroke-1'
                            }`}
                            filter="url(#card-shadow)"
                          />

                          {/* Edge Label Text */}
                          <text
                            x={0}
                            y={4}
                            textAnchor="middle"
                            className={`text-[10px] font-mono font-bold select-none ${
                              isHighlighted ? 'fill-amber-900' : 'fill-slate-800'
                            }`}
                          >
                            {edge.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* 3. Render High-Contrast Component Nodes */}
                {activeDiagram.nodes.map(node => {
                  const isHighlighted = isNodeHighlighted(node.id);
                  const isConnected = isNodeConnectedToActive(node.id);
                  const isDimmed = !isConnected && !isHighlighted;

                  const w = node.width || 240;
                  const h = node.height || 90;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => setSelectedNode(node)}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className={`cursor-pointer group transition-opacity duration-300 ${
                        isDimmed ? 'opacity-30' : 'opacity-100'
                      }`}
                    >
                      {/* Node Card Container */}
                      <rect
                        width={w}
                        height={h}
                        rx={8}
                        className={`transition-all duration-200 ${
                          isHighlighted
                            ? 'fill-amber-50/90 stroke-amber-500 stroke-3'
                            : 'fill-white stroke-slate-900 stroke-2 hover:stroke-blue-700'
                        }`}
                        filter={isHighlighted ? 'url(#active-glow)' : 'url(#card-shadow)'}
                      />

                      {/* Header Color Accent Strip */}
                      <rect
                        width={w}
                        height={6}
                        rx={3}
                        className={
                          node.type === 'system' ? 'fill-blue-600' :
                          node.type === 'process' ? 'fill-purple-600' :
                          node.type === 'github-team' ? 'fill-emerald-600' :
                          node.type === 'user' ? 'fill-indigo-600' :
                          node.type === 'security' ? 'fill-rose-600' :
                          'fill-slate-700'
                        }
                      />

                      {/* Category Badge */}
                      {node.badge && (
                        <g transform="translate(12, 16)">
                          <rect
                            width={node.badge.length * 6 + 12}
                            height={16}
                            rx={4}
                            className="fill-slate-100 stroke-slate-300 stroke-1"
                          />
                          <text
                            x={6}
                            y={11.5}
                            className="text-[9px] font-mono font-bold uppercase tracking-wider fill-slate-700"
                          >
                            {node.badge}
                          </text>
                        </g>
                      )}

                      {/* Node Primary Label */}
                      <text
                        x={12}
                        y={50}
                        className="text-xs font-black uppercase tracking-tight fill-slate-900 select-none"
                      >
                        {node.label}
                      </text>

                      {/* Short Subtitle / Purpose */}
                      <text
                        x={12}
                        y={68}
                        className="text-[10px] font-medium fill-slate-500 select-none"
                      >
                        {node.description.length > 38 ? `${node.description.substring(0, 38)}...` : node.description}
                      </text>

                      {/* Subtle Connection Port Indicators */}
                      <circle cx={0} cy={h / 2} r={3.5} className="fill-white stroke-slate-400 stroke-1.5" />
                      <circle cx={w} cy={h / 2} r={3.5} className="fill-white stroke-slate-400 stroke-1.5" />
                      <circle cx={w / 2} cy={0} r={3.5} className="fill-white stroke-slate-400 stroke-1.5" />
                      <circle cx={w / 2} cy={h} r={3.5} className="fill-white stroke-slate-400 stroke-1.5" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick Canvas Helper Footer */}
            <div className="w-full flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
              <span>Click any component to view technical specifications & SAML properties</span>
              <span>Hover over cards to isolate connected pathways</span>
            </div>
          </div>

          {/* Component Inspector Side Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border-2 border-slate-900 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-700" />
                  <span>Technical Inspector</span>
                </h3>
                {selectedNode && (
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-[10px] font-bold uppercase text-slate-500 hover:text-slate-900"
                  >
                    Clear
                  </button>
                )}
              </div>

              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-blue-700 text-white tracking-widest">
                      {selectedNode.type}
                    </span>
                    <h4 className="text-base font-black uppercase tracking-tight text-slate-900 mt-2">
                      {selectedNode.label}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {selectedNode.description}
                    </p>
                  </div>

                  {selectedNode.executivePoint && (
                    <div className="bg-emerald-50 p-3 border border-emerald-300">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
                        Executive Takeaway:
                      </span>
                      <p className="text-xs text-emerald-950 font-medium leading-snug">
                        {selectedNode.executivePoint}
                      </p>
                    </div>
                  )}

                  {selectedNode.details && selectedNode.details.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Component Specifications:
                      </span>
                      <ul className="space-y-2">
                        {selectedNode.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2 border border-slate-200 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center space-y-3 text-slate-400 bg-slate-50 border-2 border-dashed border-slate-200 p-4">
                  <Bot className="w-8 h-8 mx-auto opacity-40 text-blue-700" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Click any node in the canvas above to inspect technical SAML attributes, API scopes, and governance rules.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW MODE 2: BOARDROOM PRESENTATION SLIDES                 */}
      {/* ========================================================= */}
      {viewMode === 'presentation' && activeDiagram.executiveBrief && (
        <div className="bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-sm space-y-8">
          
          {/* Slide Deck Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">
                Management Presentation Deck • Slide 1 of 1
              </span>
              <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tight mt-1">
                Executive Architecture Overview: {activeDiagram.title}
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Prepared for PCSS II Leadership, Board of Trustees, and Department of Information Technology
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-center">
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">Total Software Cost</span>
                <span className="text-lg font-black font-mono text-emerald-700">$0.00 / YR</span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-300 text-center">
                <span className="text-[10px] font-bold uppercase text-blue-800 block">FERPA Risk</span>
                <span className="text-lg font-black font-mono text-blue-700">ZERO (0%)</span>
              </div>
            </div>
          </div>

          {/* Strategic Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-50 p-5 border-2 border-slate-900 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 pb-2 border-b border-slate-200">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  Key Management Benefits
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {activeDiagram.executiveBrief.managementBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-5 border-2 border-slate-900 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 pb-2 border-b border-slate-200">
                <Lock className="w-5 h-5" />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  Governance & Compliance
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {activeDiagram.executiveBrief.governanceChecks.map((check, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-5 border-2 border-slate-900 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 pb-2 border-b border-slate-200">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  Board Recommendation
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activeDiagram.executiveBrief.decisionImpact}
              </p>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">
                  Sign-off Status:
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <Check className="w-3.5 h-3.5" /> Ready For Immediate Deployment
                </span>
              </div>
            </div>

          </div>

          {/* Sequential Stage Visualizer for Boardroom */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              End-to-End Operational Lifecycle: Step-by-Step Flow
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeDiagram.walkthroughSteps.map((step, idx) => (
                <div key={idx} className="bg-white p-4 border-2 border-slate-900 relative space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">
                      Stage {idx + 1}
                    </span>
                  </div>

                  <h4 className="text-xs font-black uppercase text-slate-900 leading-tight">
                    {step.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-snug">
                    {step.description}
                  </p>

                  {step.managementRationale && (
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-800 font-medium">
                      ✓ {step.managementRationale}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW MODE 3: PROTOCOL & DATA MATRIX TABLE                  */}
      {/* ========================================================= */}
      {viewMode === 'sequence-table' && (
        <div className="bg-white border-2 border-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                End-to-End Protocol & Security Sequence Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Structured ledger of all API transmissions, cryptographic handshakes, and access controls.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 border border-blue-200">
              {activeDiagram.edges.length} Dispatched Endpoints
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-mono uppercase text-[10px] tracking-wider">
                  <th className="p-3 border border-slate-800">#</th>
                  <th className="p-3 border border-slate-800">Source Entity</th>
                  <th className="p-3 border border-slate-800">Action / Payload</th>
                  <th className="p-3 border border-slate-800">Target Entity</th>
                  <th className="p-3 border border-slate-800">Protocol / Standard</th>
                  <th className="p-3 border border-slate-800">Security Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activeDiagram.edges.map((edge, idx) => {
                  const fromNode = activeDiagram.nodes.find(n => n.id === edge.from);
                  const toNode = activeDiagram.nodes.find(n => n.id === edge.to);
                  return (
                    <tr key={edge.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-500 border border-slate-200">
                        0{idx + 1}
                      </td>
                      <td className="p-3 font-bold text-slate-900 border border-slate-200">
                        {fromNode?.label || edge.from}
                      </td>
                      <td className="p-3 text-slate-700 font-medium border border-slate-200">
                        {edge.label}
                      </td>
                      <td className="p-3 font-bold text-slate-900 border border-slate-200">
                        {toNode?.label || edge.to}
                      </td>
                      <td className="p-3 font-mono text-blue-700 font-bold border border-slate-200">
                        {edge.protocol || 'HTTPS REST'}
                      </td>
                      <td className="p-3 text-emerald-800 font-medium border border-slate-200">
                        ✓ Enforced 2FA & SAML
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
