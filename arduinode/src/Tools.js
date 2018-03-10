/* @flow */

export function paintBezier(
  context : CanvasRenderingContext2D,
  fromX : number,
  fromY : number,
  toX : number,
  toY : number,
  color : string | CanvasGradient | CanvasPattern) {
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(fromX, fromY);

    context.bezierCurveTo(
      fromX - Math.abs(fromX - toX) / 2, fromY,//control point 1
      toX + Math.abs(fromX - toX) / 2, toY,//control point 2
      toX, toY//end point
    );

    //context.lineTo(this.mouseX, this.mouseY);
    context.lineWidth = 2;
    context.stroke();
  };
