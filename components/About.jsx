import React from 'react'

const About = () => {
  return (
       <React.Fragment>
        <section id="about">
  <div className="section-container">
    <h2 className="section-title">About Us</h2>

    <div className="about-content">
      <div className="about-card">
        <div className="about-icon">🍢</div>
        <h3>Premium Quality</h3>
        <p>MimiRichies Bite serves authentic shawarma, grilled chicken, burgers, and noodles prepared with the freshest ingredients and traditional recipes.</p>
      </div>
      <div className="about-card">
        <div className="about-icon">🚚</div>
        <h3>Fast Delivery</h3>
        <p>Order online easily and we'll deliver your favorite meals directly to your location. Quick, reliable, and hassle-free service every time.</p>
      </div>
      
      <div className="about-card">
        <div className="about-icon">⭐</div>
        <h3>Customer Focused</h3>
        <p>Your satisfaction is our priority. We take pride in every order and ensure each meal exceeds your expectations with quality and taste.</p>
      </div>
    </div>
  </div>
</section>
       </React.Fragment>
  )
}

export default About