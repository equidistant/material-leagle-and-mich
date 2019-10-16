import React from 'react'
import styled from 'styled-components'
import { CoverImg, ImageGrid } from '../../general'
import { galleryCover } from '../../../images'
import { galleryDescription } from '../../../content'

const Home = () => {
  return (
    <Container>
      <CoverImg img={galleryCover}/>
      <ImageGrid header={'Galerija'} url={'/gallery'} content={galleryDescription}/>
    </Container>
  )
}

const Container = styled.div`
  @media only screen and (max-width: 600px) {
    padding-top: 9rem;
  }
`

export default Home