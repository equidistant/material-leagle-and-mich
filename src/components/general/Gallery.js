import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled, { css } from 'styled-components'
import justifiedLayout from 'justified-layout'
import $ from 'jquery'
import { FlexColumnCenterContainer } from './containers'
import { H3 } from './text'
import { padding, shadow } from '../../style'
import { blogImages } from '../../images'

window.jQuery = $
window.$ = $

class Gallery extends Component {
  render () {
    const { history, url, text, images } = this.props
    return (
      <Container>
        <Header onClick={ e => to({ history, url })}>{text}</Header>
        <GalleryContainer>
          {this.renderImages(images)}
        </GalleryContainer>
      </Container>
    )
  }

          // <Header onClick={ e => to({ this.props.history, this.props.url })}>{this.props.header}</Header>

  async componentDidMount() {
    window.addEventListener('resize', this.resizeListener.bind(this))
    try {
      await sleep(250)
      if (this.props.hide) {
        window.$('#gallery').justifiedGallery({ rowHeight: getRowHeight(), lastRow: 'hide', margins: 5 })
      } else {
        window.$('#gallery').justifiedGallery({ rowHeight: getRowHeight(), margins: 5 })
      }
    } catch (err) {
      await sleep(250)
      if (this.props.hide) {
        window.$('#gallery').justifiedGallery({ rowHeight: getRowHeight(), lastRow: 'hide', margins: 5 })
      } else {
        window.$('#gallery').justifiedGallery({ rowHeight: getRowHeight(), margins: 5 })
      }
    }
  }

  renderImages = (images) => images.map((image, index) => {
    return (
      <A img={image} key={index}>
        <Image img={image} />
      </A>
    )
  })

  resizeListener = () => {
    window.$('#gallery').justifiedGallery({ rowHeight: getRowHeight(), lastRow: 'hide', margins: 5 })
  }
}

const getRowHeight = () => {
  const width = window.innerWidth
  if (width < 500) {
    return 125
  } else if (width >= 500 && width < 750) {
    return 150
  } else if (width >= 750 && width < 1000) {
    return 175
  } else if (width >= 1000 && width < 1250) {
    return 200
  } else {
    return 225
  }
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const Container = styled(FlexColumnCenterContainer)`
`

const Header = styled.p`
  font-size: 4.8rem;
  letter-spacing: 0;
  line-height: 1.6;
  padding: ${padding.medium};
  font-family: 'Amatic SC';
  font-weight: 700;
  &:active {
    transform: translateY(2px);
  }
  cursor: pointer;
`

const GalleryContainer = styled.div.attrs({
  id: 'gallery'
  })
`
  margin-top: calc(${padding.small} - 2px);
`

const Image = styled.img.attrs(props => ({
  src: props.img.src,
  alt: props.img.alt
  }))`
`

const A = styled.a.attrs(props => ({
  href: props.img.url
}))``

const getImages = ({ imgUrl, length}) =>
  [...Array(length)].map((img, index) =>
  {return { id: index, alt: 'Image', src: `${process.env.REACT_APP_SERVER}/images${imgUrl}/img${index}.jpg` }})

const getRatios = ({ imgUrl }) => axios({
  method: 'get',
  url: `${process.env.REACT_APP_SERVER}/ratios{imgUrl}`
})

const to = ({ history, url }) => {
  history.push(url)
}

export default withRouter(Gallery)
