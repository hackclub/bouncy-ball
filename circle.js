export default class Circle {
  constructor({ x, y, vx, vy, radius, lineWidth, strokeColor, fillColor }) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.radius = radius
    this.lineWidth = lineWidth
    this.strokeColor = strokeColor
    this.fillColor = fillColor
  }

  update() {
    this.x += this.vx
    this.y += this.vy
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)

    if (this.fillColor) {
      ctx.fillStyle = this.fillColor
      ctx.fill()
    }

    if (this.strokeColor && this.lineWidth) {
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = this.strokeColor
      ctx.stroke()
    }
  }

  bounceAgainstCircle(circle, bounciness) {
    let dx = this.x - circle.x
    let dy = this.y - circle.y

    let distance = Math.sqrt(dx * dx + dy * dy)
    dx /= distance
    dy /= distance

    let angle = Math.atan2(dy, dx)

    let randomAngle = (Math.random() - 0.5) * Math.PI / 4

    angle += randomAngle

    this.vx = -Math.cos(angle) * bounciness
    this.vy = -Math.sin(angle) * bounciness
  }

  isOutsideCircle(circle) {
    let dx = this.x - circle.x
    let dy = this.y - circle.y

    let euclidianDistance = Math.sqrt(dx * dx + dy * dy)

    return euclidianDistance + this.radius >= circle.radius
  }

  // returns x and y coordinate of the closest point where the x and y intersect
  // with the circle's edge, including radius
  closestPoint(x, y) {
    let dx = x - this.x
    let dy = y - this.y

    let distance = Math.sqrt(dx * dx + dy * dy)

    let directionX = dx / distance
    let directionY = dy / distance

    return { x: this.x + directionX * this.radius, y: this.y + directionY * this.radius }
  }

  moveToClosestPointOfCircle(circle) {
    let dx = this.x - circle.x
    let dy = this.y - circle.y

    let distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > circle.radius - this.radius) {
      let p = this.closestPoint(circle.x, circle.y)

      this.x = p.x
      this.y = p.y
    }
  }
}