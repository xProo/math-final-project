'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface AudioVisualizerProps {
  audioData: Float32Array;
  width?: number;
  height?: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioData,
  width = 800,
  height = 200
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !audioData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain([0, audioData.length - 1])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([-1, 1])
      .range([innerHeight, 0]);

    const line = d3.line<number>()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveBasis);

    const pathData = Array.from(audioData);

    svg.append('path')
      .datum(pathData)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('d', line);

  }, [audioData, width, height]);

  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full"
      />
    </div>
  );
};

export default AudioVisualizer; 