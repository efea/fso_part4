// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0){
    return 0
  }
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  const initialValue = 0
  return blogs.reduce(reducer, initialValue)

}

module.exports = {
  dummy,
  totalLikes
}