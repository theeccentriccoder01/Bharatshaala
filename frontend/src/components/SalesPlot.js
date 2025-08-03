import React, { useEffect, useState } from 'react';
import "../App.css";
import * as d3 from 'd3';
import axios from 'axios';

const SalesPlot = () => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            const response = await axios.get('/monthlyRevenue');
            setSalesData(response.data);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    useEffect(() => {
        if (salesData.length > 0) {
            drawLinePlot();
        }
    }, [salesData]);

    const drawLinePlot = () => {

        var tooltip = d3
            .select("body")
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px");

        const margin = { top: 50, right: 30, bottom: 80, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const svg = d3.select('#sales-plot')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);


        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Monthly Sales Revenue");


        const x = d3.scaleBand()
            .domain(salesData.map(d => d.month))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(salesData, d => d.revenue + 100)])
            .range([height, 0]);

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .call(d3.axisLeft(y));

        svg.selectAll('.dot')
            .data(salesData)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(d.month) + x.bandwidth() / 2)
            .attr('cy', d => y(d.revenue))
            .attr('r', 6)
            .attr('fill', 'steelblue')
            .transition()
            .duration(1000)
            .attr('opacity', 1)
            .each(function (d) {
                const circle = d3.select(this);
                circle.on("mouseenter", function (event) {
                    const month = d.month;
                    const revenue = d.revenue;
                    const tooltipText = `Revenue in ${month}: ₹${revenue}`;
                    tooltip.style("visibility", "visible")
                        .text(tooltipText)
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
                    circle.attr('r', 8) 
                        .attr('fill', 'orange'); 
                })
                    .on("mousemove", function (event) {
                        tooltip
                            .style("left", (event.pageX) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function () {
                        tooltip.style("visibility", "hidden");
                        circle.attr('r', 6) 
                            .attr('fill', 'steelblue'); 
                    });
            });


        svg.selectAll('.line')
            .data(salesData.slice(1))
            .enter().append('line')
            .attr('class', 'line')
            .attr('x1', (d, i) => x(salesData[i].month) + x.bandwidth() / 2)
            .attr('y1', (d, i) => y(salesData[i].revenue))
            .attr('x2', (d, i) => x(salesData[i + 1].month) + x.bandwidth() / 2)
            .attr('y2', (d, i) => y(salesData[i + 1].revenue))
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('opacity', 0)
            .transition()
            .delay((d, i) => i * 500)
            .duration(1000)
            .attr('opacity', 1);

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.top + 20) 
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Month");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .text("Revenue (₹)");
    };


    return (
        <div>
            <svg id="sales-plot" className='bg-gradient-to-b from-white to-gray-100 border border-solid border-gray-400'></svg>
        </div>
    );
};

export default SalesPlot;
