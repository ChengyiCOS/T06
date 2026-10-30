
// ==========================================
// Histogram shared constants (T06-1)
// ==========================================

const margin = {
    top: 48,
    right: 28,
    bottom: 65,
    left: 72
};

const width = 900;
const height = 480;

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const barColor = "#808080";
const bodyBackgroundColor = "#fffaf0";

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

const binGenerator = d3.bin()
    .value(d => d.energyConsumption)
    .thresholds(20);

const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];


let innerChartH = null;
let fullHistogramData = [];


// ==========================================
// Scatterplot shared constants (T06-2)
// ==========================================

const marginS = {
    top: 55,
    right: 150,
    bottom: 70,
    left: 75
};

const widthS = 900;
const heightS = 480;

const innerWidthS = widthS - marginS.left - marginS.right;
const innerHeightS = heightS - marginS.top - marginS.bottom;

// Separate scales for the scatterplot
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();

// Separate colour scale for screen technology
const colorScale = d3.scaleOrdinal();

// Scatterplot chart group
let innerChartS = null;

// Tooltip dimensions
const tooltipWidth = 135;
const tooltipHeight = 36;

let tooltipS = null;
