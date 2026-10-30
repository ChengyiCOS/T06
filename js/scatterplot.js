
// ==========================================
// Draw interactive scatterplot (T06-2)
// ==========================================

const drawScatterplot = (data) => {

    // Only use records with valid values for the scatterplot.
    const scatterData = data.filter(d =>
        Number.isFinite(d.star) &&
        Number.isFinite(d.energyConsumption) &&
        Number.isFinite(d.screenSize) &&
        d.screenTech.length > 0
    );

    if (scatterData.length === 0) {
        d3.select("#scatterplot")
            .append("p")
            .attr("class", "error-message")
            .text("No valid data is available for the scatterplot.");

        return;
    }

    // Create SVG
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${widthS} ${heightS}`)
        .attr("role", "img")
        .attr(
            "aria-label",
            "Scatterplot showing TV energy consumption by star rating"
        );

    // Create a separate inner chart group.
    innerChartS = svg.append("g")
        .attr(
            "transform",
            `translate(${marginS.left},${marginS.top})`
        );

    // ======================================
    // Step 2.3: Set up x and y scales
    // ======================================

    const starExtent = d3.extent(scatterData, d => d.star);
    const energyExtent = d3.extent(
        scatterData,
        d => d.energyConsumption
    );

    xScaleS
        .domain(starExtent)
        .nice()
        .range([0, innerWidthS]);

    yScaleS
        .domain(energyExtent)
        .nice()
        .range([innerHeightS, 0]);

    // ======================================
    // Step 2.4: Set up colour scale
    // ======================================

const techOrder = ["LED", "LCD", "OLED"];

const uniqueTechs = techOrder.filter(tech =>
    scatterData.some(d =>
        d.screenTech.toUpperCase() === tech
    )
);

    colorScale
        .domain(uniqueTechs)
        .range(d3.schemeCategory10);

    // ======================================
    // Chart title
    // ======================================

    innerChartS.append("text")
        .attr("class", "chart-title")
        .attr("x", innerWidthS / 2)
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .text("Energy Consumption by Star Rating");

    // ======================================
    // Step 2.5: Draw circles
    // ======================================

    innerChartS.selectAll(".scatter-point")
        .data(scatterData)
        .join("circle")
        .attr("class", "scatter-point")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("r", 5)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5);

    // ======================================
    // Step 2.6: Add axes
    // ======================================

    innerChartS.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", `translate(0,${innerHeightS})`)
        .call(d3.axisBottom(xScaleS));

    innerChartS.append("g")
        .attr("class", "y-axis axis")
        .call(d3.axisLeft(yScaleS));

    // X-axis label
    innerChartS.append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidthS / 2)
        .attr("y", innerHeightS + 48)
        .attr("text-anchor", "middle")
        .text("Star Rating");

    // Y-axis label
    innerChartS.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeightS / 2)
        .attr("y", -52)
        .attr("text-anchor", "middle")
        .text("Energy Consumption (kWh/year)");

    // ======================================
    // Step 2.7: Add legend
    // ======================================

    const legend = innerChartS.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${innerWidthS + 20}, 10)`);

    legend.append("text")
        .attr("class", "legend-title")
        .attr("x", 0)
        .attr("y", 0)
        .text("Screen Type");

    const legendItems = legend.selectAll(".legend-item")
        .data(uniqueTechs)
        .join("g")
        .attr("class", "legend-item")
        .attr(
            "transform",
            (d, i) => `translate(0,${20 + i * 25})`
        );

    legendItems.append("circle")
        .attr("cx", 6)
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", d => colorScale(d));

    legendItems.append("text")
        .attr("class", "legend-text")
        .attr("x", 17)
        .attr("y", 4)
        .text(d => d);

    // ======================================
    // Create and activate tooltip
    // ======================================

    createTooltip();
    handleMouseEvents();
};
