<template>
  <v-layout wrap>
    <canvas id="chart1" width="350" height="150"></canvas>
  </v-layout>
</template>

<script>
import F2 from "@antv/f2";
export default {
  components: {},
  data: () => ({
    timeCountdown: 30
  }),
  created: function() {
    let self = this;
    setInterval(function() {
      self.timeCountdown--;
      if (self.timeCountdown < 0) {
        for (let i = 0; i < 3; i++) {
          self.$refs[`num${i}`] ? self.$refs[`num${i}`].start() : null;
        }
        self.timeCountdown = 30;
      }
    }, 1000);
  },
  mounted: function() {
    this.chart1();
  },
  methods: {
    formatterAnimateNumber: num => {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
      });
      return formatter.format(num);
    },
    chart1: () => {
      // 自定义线图变更动画
      F2.Animate.registerAnimation("lineUpdate", (updateShape, animateCfg) => {
        var cacheShape = updateShape.get("cacheShape"); // 该动画 shape 的前一个状态
        var cacheAttrs = cacheShape.attrs; // 上一个 shape 属性
        var oldPoints = cacheAttrs.points; // 上一个状态的关键点
        var newPoints = updateShape.attr("points"); // 当前 shape 的关键点

        var oldLength = oldPoints.length;
        var newLength = newPoints.length;
        var deltaLength = newLength - oldLength;

        var lastPoint = newPoints[newPoints.length - 1];
        for (var i = 0; i < deltaLength; i++) {
          oldPoints.push(lastPoint);
        }

        updateShape.attr(cacheAttrs);
        updateShape.animate().to({
          attrs: {
            points: newPoints
          },
          duration: 800,
          easing: animateCfg.easing
        });
      });

      // 数据源，可以指定当前时间的偏移的秒
      let generation = -1;
      function getRecord() {
        return {
          time: `${++generation}`,
          value: Math.floor(Math.random() * generation * 1000)
        };
      }
      var data = [];
      data.push(getRecord());
      data.push(getRecord());
      data.push(getRecord());

      // 实例化图表
      var chart = new F2.Chart({
        id: "chart1",
        padding: [5, "auto", 20, "auto"],
        pixelRatio: window.devicePixelRatio
      });
      chart.source(data, {
        time: {
          // type: "timeCat",
          // mask: "HH:mm:ss",
          range: [0, 1],
          tickCount: 5
        },
        value: {
          min: 1,
          tickCount: 5
        }
      });
      chart.tooltip({
        showCrosshairs: true,
        onShow: function onShow(ev) {
          var items = ev.items;
          items[0].name = items[0].title;
        }
      });
      chart
        .line()
        .position("time*value")
        .shape("smooth")
        .animate({
          update: {
            animation: "lineUpdate"
          }
        });
      chart.render();

      setInterval(() => {
        data.push(getRecord());
        if (data.length > 11) {
          data = data.slice(10);
        }
        chart.changeData(data);
        // chart.guide().tag({
        //   position: [data[data.length - 1].time, data[data.length - 1].value],
        //   content: data[data.length - 1].value,
        //   direct: "tl"
        // });
      }, 1000);
    }
  }
};
</script>

