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

const mostBlogs = (blogs) => {
  if(blogs.length === 0){
    return null
  }
  var uniques = new Array()
  var y = new Array()
  for (let i = 0; i < blogs.length; i++) {
    if(!uniques.includes(blogs[i].author)){
      uniques.push(blogs[i].author)
    }
  }
  for(let i = 0; i < uniques.length; i++){
    y[i] = 0
  }
  for (let i = 0; i < uniques.length; i++) {
    for (let k = 0; k < blogs.length; k++) {
      if(uniques[i] === blogs[k].author){
        y[i] = y[i] + 1
      }
    }
  }

  var maxi = 0
  var indexOfMax = 0
  for (let i = 0; i < y.length; i++) {
    if(y[i] >= maxi){
      maxi = y[i]
      indexOfMax = i
    }
  }
  const xx = uniques[indexOfMax]
  return {
    author: xx,
    blogs: maxi
  }

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}