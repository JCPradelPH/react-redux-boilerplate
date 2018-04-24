import React from 'react'

export const LoaderAnimSm = (props) => {
  return(
    process.env.NODE_ENV=='development'?
    <img class="loader-anim-sm" src="../css/images/loader.gif" /> :
    <img class="loader-anim-sm" src="css/images/loader.gif" />
  )
}
export const LoaderAnimSLg = (props) => {
  return(
    process.env.NODE_ENV=='development'?
    <img class="loader-anim-lg" src="../css/images/loader.gif" /> :
    <img class="loader-anim-lg" src="css/images/loader.gif" />
  )
}
