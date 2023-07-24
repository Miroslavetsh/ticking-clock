const compose =
  (...fns) =>
  (arg) =>
    fns.reduce((acc, fn) => fn(acc), arg)

// utils
const oneSecond = () => 1000
const getCurrentTime = () => new Date()
const clear = () => console.clear()
const log = (message) => console.log(message)

// Business Layer
const serializeClockTime = (date) => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds(),
})

const civilianHours = (clockTime) => ({
  ...clockTime,
  hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours,
})

const appendAMPM = (clockTime) => ({
  ...clockTime,
  ampm: clockTime.hours < 12 ? 'AM' : 'PM',
})

//  HOFs
const display = (target) => (time) => target(time)

const formatClock = (format) => (clockTime) =>
  format
    .replace('hh', clockTime.hours)
    .replace('mm', clockTime.minutes)
    .replace('ss', clockTime.seconds)
    .replace('tt', clockTime.ampm)

const prependZero = (key) => (clockTime) => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? '0' + clockTime[key] : clockTime[key],
})

// Composition of small parts
const convertToCivilian = (clockTime) => compose(appendAMPM, civilianHours)(clockTime)
const doubleDigits = (civilianTime) =>
  compose(prependZero('hours'), prependZero('minutes'), prependZero('seconds'))(civilianTime)

const startTicking = () => {
  setInterval(
    compose(
      clear,
      getCurrentTime,
      serializeClockTime,
      convertToCivilian,
      doubleDigits,
      formatClock('hh:mm:ss tt'),
      display(log),
    ),
    oneSecond(),
  )
}

startTicking()
