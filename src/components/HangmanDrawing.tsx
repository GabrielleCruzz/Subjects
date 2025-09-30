const HEAD = (
  <div
    key="head"
    className="w-12 h-12 border-4 border-foreground rounded-full absolute top-[42px] right-[-18px]"
  />
)

const BODY = (
  <div
    key="body"
    className="w-1 h-24 bg-foreground absolute top-[88px] right-0"
  />
)

const RIGHT_ARM = (
  <div
    key="right-arm"
    className="w-20 h-1 bg-foreground absolute top-[120px] right-[-80px] rotate-[-30deg] origin-bottom-left"
  />
)

const LEFT_ARM = (
  <div
    key="left-arm"
    className="w-20 h-1 bg-foreground absolute top-[120px] right-[4px] rotate-[30deg] origin-bottom-right"
  />
)

const RIGHT_LEG = (
  <div
    key="right-leg"
    className="w-24 h-1 bg-foreground absolute top-[180px] right-[-92px] rotate-[60deg] origin-bottom-left"
  />
)

const LEFT_LEG = (
  <div
    key="left-leg"
    className="w-24 h-1 bg-foreground absolute top-[180px] right-0 rotate-[-60deg] origin-bottom-right"
  />
)

const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG]

type HangmanDrawingProps = {
  numberOfGuesses: number
}

export const HangmanDrawing = ({ numberOfGuesses }: HangmanDrawingProps) => {
  return (
    <div className="relative">
      {BODY_PARTS.slice(0, numberOfGuesses)}
      <div className="h-12 w-1 bg-foreground absolute top-0 right-0" />
      <div className="h-1 w-48 bg-foreground ml-28" />
      <div className="h-96 w-1 bg-foreground ml-28" />
      <div className="h-1 w-64 bg-foreground" />
    </div>
  )
}
