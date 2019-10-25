import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { galleryImages } from '../../../images'
import styled from 'styled-components'
import axios from 'axios'

const NF = 30
const TFN = {
	'ease-in-out': (k) => .5*(Math.sin((k - .5)*Math.PI) + 1)
}

class SwipeGallery extends Component {
  state = {
    _C: '',
    N: '',
    i: parseInt(this.props.match.params.id),
    x0: null,
    locked: false,
    w: window.innerWidth,
    ini: '',
    fin: '',
    rID: null,
    anf: '',
    n: '',
		images: galleryImages['soca'],
		sizes: []
  }
  render () {
    return (
      <Container>
				 {this.renderImages({ images: this.state.images, sizes: this.state.sizes })}
      </Container>
    )
  }
  async componentDidMount() {
		const ratios = await getRatios({ imgUrl: '/soca' })
		const sizes = ratios.data.map(ratio => {
			if (ratio < 1) {
				return { width: (window.innerHeight - 20) * ratio, height: window.innerHeight - 20, margin: (window.innerWidth - (window.innerHeight - 20) * ratio) / 2 }
			}
			else {
				let height = window.innerHeight - 20
				let width = height * ratio
				while (width > window.innerWidth) {
					height = height - 10
					width = height * ratio
				}
				return { width, height, margin: (window.innerWidth - width) / 2}
			}
		})
		this.setState({ sizes })
    const _C = document.querySelector('#container')
    const N = _C.children.length
    _C.style.setProperty('--n', _C.children.length)
		_C.style.setProperty('--i', parseInt(this.props.match.params.id))
    _C.addEventListener('mousedown', this.lock.bind(this), false)
    _C.addEventListener('touchstart', this.lock.bind(this), false)

    _C.addEventListener('mousemove', this.drag.bind(this), false)
    _C.addEventListener('touchmove', this.drag.bind(this), false)

    _C.addEventListener('mouseup', this.move.bind(this), false)
    _C.addEventListener('touchend', this.move.bind(this), false)
		_C.addEventListener('mouseup', this.updateUrl.bind(this), false)
		_C.addEventListener('touchend', this.updateUrl.bind(this), false)
    this.setState({ _C, N })
  }

	renderImages = ({ images, sizes }) => {
		if (sizes.length !== 0) {
			return images.map((image, index) => <Img img={image} key={index} size={sizes[index]} />)
		} else {
			return null
		}
	}

	updateUrl =  async () => {
		await sleep(200)
		this.props.history.push(`/gallery/swipe/${this.state.i}`)
	}


  stopAni = () => {
    cancelAnimationFrame(this.state.rID)
    this.state.rID = null
  }

  ani = (cf = 0) => {
    this.state._C.style.setProperty('--i', this.state.ini + ( this.state.fin -  this.state.ini)*TFN['ease-in-out'](cf/ this.state.anf))

    if(cf ===  this.state.anf) {
      this.stopAni()
      return
    }

    this.setState({
      rID: requestAnimationFrame(this.ani.bind(this, ++cf))
    })
  }

  unify = (e) => e.changedTouches ? e.changedTouches[0] : e

  lock = (e) => {
    this.setState({
      x0: this.unify(e).clientX,
      locked: true
    })
  }

  drag = (e) => {
    e.preventDefault()

    if(this.state.locked) {
      let dx = this.unify(e).clientX - this.state.x0
      let f = +(dx/this.state.w).toFixed(2)
      this.state._C.style.setProperty('--i', this.state.i - f)
    }
  }

  move = (e) => {
    if(this.state.locked) {
      let dx = this.unify(e).clientX - this.state.x0
      let s = Math.sign(dx)
      let f = +(s*dx/this.state.w).toFixed(2)

      this.setState({
        ini: this.state.i - s*f
      })
      if((this.state.i > 0 || s < 0) && (this.state.i < this.state.N - 1 || s > 0) && f > .2) {
        this.setState({
          i: this.state.i - s
        })
        f = 1 - f
      }

      this.setState({
        fin: this.state.i,
        anf: Math.round(f*NF),
        n: 2 + Math.round(f)
      })
      this.ani()
      this.setState({
        x0: null,
        locked: false
      })
    }
  }
}

const Container = styled.div.attrs({
  id: 'container'
  })
`
  --n: 1;
	height: 100%;
  display: flex;
  align-items: center;
  width: 100%;
  width: calc(var(--n)*100%);
  transform: translate(calc(var(--i, 0)/var(--n)*-100%));
`

const Img = styled.img.attrs(props => ({
  src: props.img.src
  }))`
	width: ${props => props.size.width}px;
	height: ${props => props.size.height}px;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
	margin-left: ${props => props.size.margin}px;
	margin-right: ${props => props.size.margin}px;
`

// width: auto;

const getRatios = ({ imgUrl }) => axios({
	method: 'get',
	url: `${process.env.REACT_APP_SERVER}/ratios${imgUrl}`
})

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default withRouter(SwipeGallery)