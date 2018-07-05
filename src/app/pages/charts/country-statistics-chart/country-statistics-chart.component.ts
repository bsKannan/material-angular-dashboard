import * as d3 from 'd3';
import * as nv from 'nvd3';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-country-statistics-chart',
  styleUrls: ['./country-statistics-chart.component.scss'],
  templateUrl: './country-statistics-chart.component.html',
})
export class CountryStatisticsChartComponent implements OnInit {
  public ngOnInit() {
    const COLORS = {
      red: '#f44336',
      lightBlue: '#03a9f4',
      orange: '#ffc107',
      amber: '#ff9800',
      teal: '#00bcd4',
      purple: '#7726d3',
      green: '#00d45a',
      rowBgColor: '#4a4a4a',
    };

    const container2 = d3.select('.chart2__container');
    if (container2[0][0]) {
      const colors = [
        COLORS.purple,
        COLORS.red,
        COLORS.orange,
        COLORS.teal,
        COLORS.lightBlue,
      ];

      const data = [
        {
          key: 'United States',
          y: 31,
        },
        {
          key: 'Belarus',
          y: 26,
        },
        {
          key: 'Italy',
          y: 18,
        },
        {
          key: 'France',
          y: 15,
        },
        {
          key: 'Other',
          y: 10,
        },
      ];

      nv.addGraph(() => {
        let innerRadius = 0.06;
        const outerRadius = 1.02;

        const pieChart = nv.models.pieChart()
          .x(d => d.key)
          .y(d => d.y)
          .showLabels(false)
          .donut(true)
          .growOnHover(true)
          .padAngle(.04)
          .cornerRadius(0)
          .margin({ left: -10, right: -10, top: -10, bottom: -10 })
          .color(colors)
          .arcsRadius([{ inner: innerRadius, outer: outerRadius },
            { inner: innerRadius, outer: outerRadius },
            { inner: innerRadius, outer: outerRadius },
            { inner: innerRadius, outer: outerRadius },
            { inner: innerRadius, outer: outerRadius },
          ])
          .showLegend(false)
          .title('0%');

        pieChart.tooltip.enabled(true)
          .hideDelay(0)
          .headerEnabled(false)
          .contentGenerator((d) => {
            if (d === null) {
              return '';
            }
            d3.selectAll('.nvtooltip').classed('mdl-tooltip', true);
            return d.data.y + '%';
          });

        container2.append('div')
          .append('svg')
          .datum(data)
          .transition().duration(1200)
          .call(pieChart);

        let h = 0;
        const i = 0.08;
        let sum = 0;
        data.forEach((item) => {
          sum = sum + item.y;
        });

        const timer = setInterval(animatePie, 30, data);

        function animatePie() {
          if (innerRadius < 0.86) {
            pieChart.arcsRadius([{ inner: innerRadius, outer: outerRadius },
              { inner: innerRadius, outer: outerRadius },
              { inner: innerRadius, outer: outerRadius },
              { inner: innerRadius, outer: outerRadius },
              { inner: innerRadius, outer: outerRadius },
            ])
              .title(h + '%')
              .update();
            innerRadius += i;
            h += 10;
          } else {
            innerRadius = 0.86;
            pieChart.arcsRadius([{ inner: innerRadius, outer: outerRadius },
              { inner: innerRadius, outer: outerRadius },
              { inner: innerRadius, outer: outerRadius },
              { inner: innerRadius, outer: outerRadius },
              { inner: innerRadius, outer: outerRadius },
            ])
              .update();
            clearInterval(timer);
          }
        }

        const color = d3.scale.ordinal().range(colors);

        const legend = container2.append('div')
          .attr('class', 'legend')
          .selectAll('.legend__item')
          .data(data)
          .enter()
          .append('div')
          .attr('class', 'legend__item');

        legend.append('div')
          .attr('class', 'legend__mark pull-left')
          .style('background-color', (d => color(d.key)) as any);

        legend.append('div')
          .attr('class', 'legend__text')
          .text(d => d.key);

        return pieChart;
      });
    }
  }
}
