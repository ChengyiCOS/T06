// Draw the histogram frame and render the initial (all TVs) distribution.
const drawHistogram = (data) => {
    fullHistogramData = data;

    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-label", "Histogram showing the frequency of TV energy consumption");

    innerChartH = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Keep the same horizontal scale for every filter so comparisons are fair.
    const extent = d3.extent(data, d => d.energyConsumption);
    const padding = (extent[1] - extent[0]) * 0.02 || 1;
    xScale.domain([Math.max(0, extent[0] - padding), extent[1] + padding])
        .range([0, innerWidth]);

    binGenerator.domain(xScale.domain());

    innerChartH.append("text")
        .attr("class", "chart-title")
        .attr("x", innerWidth / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .text("Energy Consumption for different TVs types and sizes");

    // Gridlines make frequencies easier to compare.
    innerChartH.append("g")
        .attr("class", "grid")
        .attr("class", "grid y-grid");

    innerChartH.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", `translate(0,${innerHeight})`);

    innerChartH.append("g")
        .attr("class", "y-axis axis");

    innerChartH.append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 48)
        .attr("text-anchor", "middle")
        .text("Labeled Energy Consumption (kWh/year)");

    innerChartH.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -52)
        .attr("text-anchor", "middle")
        .text("Frequency");

    updateHistogram("all", data);
};

// Re-render bars and vertical scale using the selected subset.
const renderHistogramBins = (selectedData) => {
    const bins = binGenerator(selectedData);
    const maxCount = d3.max(bins, d => d.length) || 1;

    yScale.domain([0, maxCount]).nice()
        .range([innerHeight, 0]);

    const t = d3.transition().duration(450);

    innerChartH.select(".y-grid")
        .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(""));

    innerChartH.select(".x-axis")
        .transition(t)
        .call(d3.axisBottom(xScale));

    innerChartH.select(".y-axis")
        .transition(t)
        .call(d3.axisLeft(yScale).ticks(5));

    const bars = innerChartH.selectAll(".histogram-bar")
        .data(bins, d => `${d.x0}-${d.x1}`);

    bars.exit()
        .transition(t)
        .attr("y", innerHeight)
        .attr("height", 0)
        .remove();

    bars.enter()
        .append("rect")
        .attr("class", "histogram-bar")
        .attr("x", d => xScale(d.x0) + 1)
        .attr("y", innerHeight)
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
        .attr("height", 0)
        .merge(bars)
        .transition(t)
        .attr("x", d => xScale(d.x0) + 1)
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
        .attr("height", d => innerHeight - yScale(d.length));
};
