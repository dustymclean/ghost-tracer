import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Connection } from '../types';

interface NetworkGraphProps {
  centerNode: string;
  connections: Connection[];
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ centerNode, connections }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !connections.length) return;

    const width = svgRef.current.clientWidth;
    const height = 400;
    
    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("background", "transparent");

    // Prepare data
    const nodes = [
      { id: centerNode, group: 1, r: 25 },
      ...connections.map(c => ({ id: c.name, group: 2, r: 15 + (c.strength / 2) }))
    ];

    const links = connections.map(c => ({
      source: centerNode,
      target: c.name,
      value: c.strength
    }));

    // Simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.r + 10));

    // Lines
    const link = svg.append("g")
      .attr("stroke", "#3d3d5c")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    // Nodes
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.r)
      .attr("fill", d => d.group === 1 ? "#00f0ff" : "#2a2a40")
      .attr("stroke", d => d.group === 1 ? "#00f0ff" : "#00ff9d")
      .call(drag(simulation) as any);

    // Labels
    const labels = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.id)
      .attr("font-size", d => d.group === 1 ? "14px" : "12px")
      .attr("fill", "#e0e0e0")
      .attr("dx", 15)
      .attr("dy", 4)
      .style("font-family", "JetBrains Mono")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [centerNode, connections]);

  return (
    <div className="w-full h-[400px] border border-osint-700 bg-osint-800/50 rounded-lg overflow-hidden relative">
      <div className="absolute top-2 left-3 text-xs text-osint-accent font-mono uppercase tracking-widest bg-osint-900/80 px-2 py-1 rounded">
        Entity Network
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default NetworkGraph;