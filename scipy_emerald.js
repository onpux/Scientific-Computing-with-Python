// Emerald background with falling red diamonds
(function() {
  const canvas = document.getElementById('emerald-bg');
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  }
  window.addEventListener('resize', resize);
  resize();
  // Red diamonds
  const diamonds = Array.from({length: 18}, () => ({
    x: Math.random()*W,
    y: -40 - Math.random()*H*0.5,
    r: 18 + Math.random()*18,
    dy: 1.1 + Math.random()*1.2,
    dx: -0.3 + Math.random()*0.6,
    rot: Math.random()*Math.PI*2
  }));
  function drawDiamond(cx, cy, r, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r*0.7, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r*0.7, 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(229,57,53,0.85)';
    ctx.shadowColor = '#e53935';
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    for(const d of diamonds) {
      drawDiamond(d.x, d.y, d.r, d.rot);
      d.y += d.dy;
      d.x += d.dx;
      d.rot += 0.01;
      if(d.y-d.r>H || d.x+d.r<0 || d.x-d.r>W) {
        d.x = Math.random()*W;
        d.y = -40 - Math.random()*H*0.5;
        d.r = 18 + Math.random()*18;
        d.rot = Math.random()*Math.PI*2;
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// Project 1: Free Fall Simulator (visual, D3.js, CSV demo)
(function() {
  // Demo: use a public CSV for time/height (simulate free fall)
  d3.csv('https://raw.githubusercontent.com/uiuc-cse/data-fa14/gh-pages/data/iris.csv').then(() => {
    // Simulated data for free fall with air resistance
    const data = [
      {t:0, h:100}, {t:1, h:80}, {t:2, h:65}, {t:3, h:52}, {t:4, h:41}, {t:5, h:32}, {t:6, h:25}, {t:7, h:19}, {t:8, h:15}, {t:9, h:12}, {t:10, h:10}
    ];
    const svg = d3.select('#project1').append('svg').attr('width', 420).attr('height', 220);
    const margin = {top: 30, right: 20, bottom: 40, left: 50}, width = 420-margin.left-margin.right, height = 220-margin.top-margin.bottom;
    const g = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().domain([0,10]).range([0,width]);
    const y = d3.scaleLinear().domain([0,100]).range([height,0]);
    g.append('g').attr('transform',`translate(0,${height})`).call(d3.axisBottom(x));
    g.append('g').call(d3.axisLeft(y));
    g.append('path')
      .datum(data)
      .attr('fill','none')
      .attr('stroke','#ff8a80')
      .attr('stroke-width',3)
      .attr('d',d3.line().x(d=>x(d.t)).y(d=>y(d.h)));
    g.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('cx',d=>x(d.t))
      .attr('cy',d=>y(d.h))
      .attr('r',5)
      .attr('fill','#ffd6d6');
    svg.append('text').attr('x',width/2+margin.left).attr('y',18).attr('text-anchor','middle').attr('fill','#fff').attr('font-size','1.1em').text('Free Fall Height vs Time');
    svg.append('text').attr('x',width/2+margin.left).attr('y',height+margin.top+35).attr('text-anchor','middle').attr('fill','#fff').text('Time (s)');
    svg.append('text').attr('x',10).attr('y',height/2+margin.top).attr('text-anchor','middle').attr('fill','#fff').attr('transform',`rotate(-90,10,${height/2+margin.top})`).text('Height (m)');
  });
})();

// Project 2: SI Units Converter (visual, JSON demo + interactive input)
(function() {
  // Demo: show a table of unit conversions and an interactive converter
  const units = [
    {type:'Length', from:'meter', to:'kilometer', factor:0.001},
    {type:'Mass', from:'gram', to:'kilogram', factor:0.001},
    {type:'Energy', from:'joule', to:'kilojoule', factor:0.001},
    {type:'Time', from:'second', to:'minute', factor:1/60},
    {type:'Pressure', from:'pascal', to:'bar', factor:1e-5}
  ];
  // Interactive converter UI
  const container = d3.select('#project2').append('div').style('margin','18px 0');
  container.append('input')
    .attr('type','number')
    .attr('id','unitInput')
    .attr('placeholder','Value')
    .style('width','90px')
    .style('margin-right','8px')
    .style('padding','6px')
    .style('border-radius','6px');
  const select = container.append('select').attr('id','unitSelect').style('margin-right','8px').style('padding','6px').style('border-radius','6px');
  select.selectAll('option')
    .data(units)
    .enter().append('option')
    .attr('value',(d,i)=>i)
    .text(d=>`${d.from} → ${d.to}`);
  container.append('button')
    .text('Convert')
    .style('padding','6px 16px')
    .style('border-radius','6px')
    .style('background','#ff8a80')
    .style('color','#fff')
    .on('click',function() {
      const val = parseFloat(document.getElementById('unitInput').value);
      const idx = document.getElementById('unitSelect').value;
      if(isNaN(val)) {
        d3.select('#unitResult').text('Please enter a value.');
        return;
      }
      const u = units[idx];
      d3.select('#unitResult').text(`${val} ${u.from} = ${(val*u.factor).toPrecision(6)} ${u.to}`);
    });
  container.append('span').attr('id','unitResult').style('margin-left','18px').style('color','#ffd6d6').style('font-weight','bold');
  // Table of conversions
  const table = d3.select('#project2').append('table').style('width','100%').style('background','rgba(0,77,64,0.7)').style('color','#fff').style('border-radius','10px').style('margin','18px 0');
  const thead = table.append('thead');
  thead.append('tr').selectAll('th').data(['Type','From','To','Factor']).enter().append('th').text(d=>d).style('padding','8px').style('color','#ff8a80');
  const tbody = table.append('tbody');
  units.forEach(u=>{
    const row = tbody.append('tr');
    row.append('td').text(u.type).style('padding','6px');
    row.append('td').text(u.from);
    row.append('td').text(u.to);
    row.append('td').text(u.factor);
  });
})();

// Project 3: Symbolic ODE Model (visual, CSV demo)
(function() {
  // Demo: show a plot of a harmonic oscillator (simulated data)
  d3.csv('https://raw.githubusercontent.com/uiuc-cse/data-fa14/gh-pages/data/iris.csv').then(() => {
    // Simulated ODE: x(t) = A cos(wt), A=1, w=1
    const data = d3.range(0,7,0.2).map(t=>({t,x:Math.cos(t)}));
    const svg = d3.select('#project3').append('svg').attr('width', 420).attr('height', 220);
    const margin = {top: 30, right: 20, bottom: 40, left: 50}, width = 420-margin.left-margin.right, height = 220-margin.top-margin.bottom;
    const g = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().domain([0,7]).range([0,width]);
    const y = d3.scaleLinear().domain([-1,1]).range([height,0]);
    g.append('g').attr('transform',`translate(0,${height})`).call(d3.axisBottom(x));
    g.append('g').call(d3.axisLeft(y));
    g.append('path')
      .datum(data)
      .attr('fill','none')
      .attr('stroke','#ffd6d6')
      .attr('stroke-width',3)
      .attr('d',d3.line().x(d=>x(d.t)).y(d=>y(d.x)));
    g.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('cx',d=>x(d.t))
      .attr('cy',d=>y(d.x))
      .attr('r',4)
      .attr('fill','#ff8a80');
    svg.append('text').attr('x',width/2+margin.left).attr('y',18).attr('text-anchor','middle').attr('fill','#fff').attr('font-size','1.1em').text('Harmonic Oscillator: x(t) = cos(t)');
    svg.append('text').attr('x',width/2+margin.left).attr('y',height+margin.top+35).attr('text-anchor','middle').attr('fill','#fff').text('Time (s)');
    svg.append('text').attr('x',10).attr('y',height/2+margin.top).attr('text-anchor','middle').attr('fill','#fff').attr('transform',`rotate(-90,10,${height/2+margin.top})`).text('x(t)');
  });
})();
