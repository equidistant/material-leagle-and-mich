import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { galleryImageBundle } from '../../../images'
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
		images: galleryImageBundle(this.props.match.params.galleryName).images,
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
		await sleep(200)
		const ratios = galleryImageBundle(this.props.match.params.galleryName).ratios
		const sizes = ratios.map(ratio => {
			if (ratio < 1) {
				let height = window.innerHeight - 20
				let width = height * ratio
				while (height > window.innerHeight || width > window.innerWidth) {
					height = height * 0.99
					width = height * ratio
				}
				return { width: height * ratio, height: height, margin: (window.innerWidth - width) / 2 }
			}
			else {
				let height = window.innerHeight - 20
				let width = height * ratio
				while (height > window.innerHeight || width > window.innerWidth) {
					height = height * 0.99
					width = height * ratio
				}
				return { width, height, margin: (window.innerWidth - width) / 2}
			}
		})
		console.log(sizes)
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
		window.addEventListener('resize', this.setSizes.bind(this))
    this.setState({ _C, N })
  }

	setSizes = () => {
		window.location.href = window.location.href
	}

	renderImages = ({ images, sizes }) => {
		if (sizes.length !== 0) {
			return images.map((image, index) => {
				return <Img img={image} key={index} size={sizes[index]} />
			})
		} else {
			return null
		}
	}

	updateUrl = async () => {
		await sleep(200)
		this.props.history.push(`/gallery/${this.props.match.params.galleryName}/testswipe/${this.state.i}`)
	}


  stopAni = () => {
    cancelAnimationFrame(this.state.rID)
    this.state.rID = null
  }

  ani = (cf = 0) => {
		const i = this.state.ini + ( this.state.fin -  this.state.ini)*TFN['ease-in-out'](cf/ this.state.anf)
		if (i) {
			 this.state._C.style.setProperty('--i', this.state.ini + ( this.state.fin -  this.state.ini)*TFN['ease-in-out'](cf/ this.state.anf))
		}

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