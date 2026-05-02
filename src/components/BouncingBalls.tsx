import { useEffect, useRef, type FC } from "react"

interface Ball {
  fillColor: string
  radius: number
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: number
  vx: number
  vy: number
  draw: (ctx: CanvasRenderingContext2D) => void
}

interface BouncingBallsProps {
  numBalls?: number
  backgroundColor?: string
  colors?: string[]
  opacity?: number
  minRadius?: number
  maxRadius?: number
  speed?: number
  bounceDamping?: number
  gravity?: number
  friction?: number
  interactionRadius?: number
  interactionScale?: number
  interactive?: boolean
  followMouse?: boolean
  trailAlpha?: number
}

export const BouncingBalls: FC<BouncingBallsProps> = ({
  numBalls = 80,
  backgroundColor = "transparent",
  colors = ["#D3DFF2", "#C5D5F0", "#B8C8E8"],
  opacity = 0.6,
  minRadius = 5,
  maxRadius = 12,
  speed = 0.12,
  bounceDamping = 1,
  gravity = 0,
  friction = 1,
  interactionRadius = 120,
  interactionScale = 3,
  interactive = true,
  followMouse = false,
  trailAlpha = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    const getRandomColor = (): string => {
      if (colors && colors.length > 0) {
        return colors[Math.floor(Math.random() * colors.length)]
      }
      return `rgba(${Math.ceil(Math.random() * 255)}, ${Math.ceil(
        Math.random() * 255
      )}, ${Math.ceil(Math.random() * 255)}, ${opacity})`
    }

    const createBall = (fillColor: string, radius: number): Ball => ({
      fillColor,
      radius,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      vx: 0,
      vy: 0,
      draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.scale(this.scaleX, this.scaleY)
        ctx.rotate(this.rotation)
        ctx.globalAlpha = opacity
        ctx.fillStyle = this.fillColor
        ctx.shadowColor = this.fillColor
        ctx.shadowBlur = this.radius * 2.5
        ctx.beginPath()
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      },
    })

    const mouse = { x: W / 2, y: H / 2 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.pageX - canvas.offsetLeft
      mouse.y = e.pageY - canvas.offsetTop
    }
    if (interactive) canvas.addEventListener("mousemove", handleMouseMove)

    const balls: Ball[] = []
    for (let i = 0; i < numBalls; i++) {
      const ball = createBall(getRandomColor(), Math.random() * (maxRadius - minRadius) + minRadius)
      ball.x = Math.random() * W
      ball.y = Math.random() * H
      ball.vx = (Math.random() * 2 - 1) * speed
      ball.vy = (Math.random() * 2 - 1) * speed
      balls.push(ball)
    }

    const updateBall = (ball: Ball) => {
      ball.vy += gravity
      ball.vx *= friction
      ball.vy *= friction

      ball.x += ball.vx
      ball.y += ball.vy

      if (ball.x + ball.radius > W) {
        ball.x = W - ball.radius
        ball.vx *= -bounceDamping
      } else if (ball.x - ball.radius < 0) {
        ball.x = ball.radius
        ball.vx *= -bounceDamping
      }

      if (ball.y + ball.radius > H) {
        ball.y = H - ball.radius
        ball.vy *= -bounceDamping
      } else if (ball.y - ball.radius < 0) {
        ball.y = ball.radius
        ball.vy *= -bounceDamping
      }

      if (followMouse) {
        const dx = mouse.x - ball.x
        const dy = mouse.y - ball.y
        ball.vx += dx * 0.0005
        ball.vy += dy * 0.0005
      }
    }

    const enlargeBalls = (ball: Ball) => {
      if (!interactive) return
      const dx = mouse.x - ball.x
      const dy = mouse.y - ball.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < interactionRadius) {
        ball.scaleX = ball.scaleY = interactionScale
      } else if (distance < interactionRadius * 2) {
        ball.scaleX = ball.scaleY = 1 + (interactionScale - 1) * (1 - (distance - interactionRadius) / interactionRadius)
      } else {
        ball.scaleX = ball.scaleY = 1
      }
    }

    let rafId: number
    const animate = () => {
      rafId = requestAnimationFrame(animate)

      if (trailAlpha < 1) {
        ctx.fillStyle = backgroundColor === "transparent"
          ? `rgba(0, 0, 0, ${1 - trailAlpha})`
          : backgroundColor
        ctx.fillRect(0, 0, W, H)
      } else {
        ctx.clearRect(0, 0, W, H)
      }

      balls.forEach((ball) => {
        enlargeBalls(ball)
        updateBall(ball)
        ball.draw(ctx)
      })
    }

    animate()

    const handleResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      if (interactive) canvas.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [
    numBalls,
    backgroundColor,
    colors,
    opacity,
    minRadius,
    maxRadius,
    speed,
    bounceDamping,
    gravity,
    friction,
    interactionRadius,
    interactionScale,
    interactive,
    followMouse,
    trailAlpha,
  ])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        backgroundColor,
      }}
    />
  )
}
