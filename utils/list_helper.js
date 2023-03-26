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
const favoriteBlog = (blogs) => {
  if(blogs.length === 0) {
    return null
  }
  let max = 0
  let index = 0

  for (let i = 0; i < blogs.length; i++) {
    if(blogs[i].likes >= max){
      max = blogs[i].likes
      index = i
    }
  }
  const favBlog = blogs[index]

  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}