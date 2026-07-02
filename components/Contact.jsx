import React from 'react'

const Contact = () => {
  return (
        <React.Fragment>
            <section id="contact">
  <h2 className="section-title">Get In Touch</h2>
  <p className="section-subtitle">We'd love to hear from you</p>
 
  <div className="contact-layout">
 
    {/* <!-- LEFT PANEL --> */}
    <div className="card">
      <div className="badge">
        <i className="ti ti-message-circle"></i>
        Let's talk
      </div>
 
      <p className="left-title">Get in touch</p>
      <p className="left-desc">
        Whether you have a question about our services, pricing, or just want to say hello — we're ready to answer all your questions and get you started.
      </p>
 
      <div className="sep"></div>
 
      <div className="info-row">
        <div className="icon-wrap"><i className="ti ti-map-pin"></i></div>
        <div>
          <p className="info-label">Office location</p>
          <p className="info-value">Pentagon Hotel and suites choba,Port Harcourt, Rivers State</p>
          <p className="info-sub">Nigeria</p>
        </div>
      </div>
 
      <div className="info-row">
        <div className="icon-wrap"><i className="ti ti-clock"></i></div>
        <div>
          <p className="info-label">Business hours</p>
          <p className="info-value">Sun – Sat, 9:00 AM – 9:00 PM</p>
          <p className="info-sub">West Africa Time (WAT)</p>
        </div>
      </div>
 
      <div className="info-row">
        <div className="icon-wrap"><i className="ti ti-world"></i></div>
        <div>
          <p className="info-label">Time zone</p>
          <p className="info-value">UTC +1 (West Africa Time)</p>
        </div>
      </div>
 
      <div className="sep"></div>
 
      <div className="availability-row">
        <div className="dot"></div>
        <p className="availability-text">Currently available for new projects</p>
      </div>

            {/* this part houses the SVG for the socials handles */}

      <div className="social-row">
        <a href="https://www.linkedin.com/in/morgan-edache-875a8b2b8/" className="social-btn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><i className="ti ti-brand-linkedin">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M20.45175,20.45025 L16.89225,20.45025 L16.89225,14.88075 C16.89225,13.5525 16.86975,11.844 15.04275,11.844 C13.191,11.844 12.90825,13.2915 12.90825,14.7855 L12.90825,20.45025 L9.3525,20.45025 L9.3525,8.997 L12.765,8.997 L12.765,10.563 L12.81375,10.563 C13.2885,9.66225 14.4495,8.71275 16.18125,8.71275 C19.78575,8.71275 20.45175,11.08425 20.45175,14.169 L20.45175,20.45025 Z M5.33925,7.4325 C4.1955,7.4325 3.27375,6.50775 3.27375,5.36775 C3.27375,4.2285 4.1955,3.30375 5.33925,3.30375 C6.47775,3.30375 7.4025,4.2285 7.4025,5.36775 C7.4025,6.50775 6.47775,7.4325 5.33925,7.4325 L5.33925,7.4325 Z M7.11975,20.45025 L3.5565,20.45025 L3.5565,8.997 L7.11975,8.997 L7.11975,20.45025 Z M23.00025,0 L1.0005,0 C0.44775,0 0,0.44775 0,0.99975 L0,22.9995 C0,23.55225 0.44775,24 1.0005,24 L23.00025,24 C23.55225,24 24,23.55225 24,22.9995 L24,0.99975 C24,0.44775 23.55225,0 23.00025,0 L23.00025,0 Z"></path></svg>
        </i></a>
        <a href="https://twitter.com/MorganEdache" className="social-btn" aria-label="X / Twitter" target="_blank"><i className="ti ti-brand-x">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"></path></svg> </i></a>
        <a href="https://www.instagram.com/richardtls/" className="social-btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i className="ti ti-brand-instagram">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
        </i></a>
        <a href="https://wa.me/2349050928447" className="social-btn" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><i className="ti ti-brand-whatsapp">
          <svg stroke="currentColor" fill="currentColor" strokeidth="0" viewBox="0 0 512 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M414.73 97.1A222.14 222.14 0 0 0 256.94 32C134 32 33.92 131.58 33.87 254a220.61 220.61 0 0 0 29.78 111L32 480l118.25-30.87a223.63 223.63 0 0 0 106.6 27h.09c122.93 0 223-99.59 223.06-222A220.18 220.18 0 0 0 414.73 97.1zM256.94 438.66h-.08a185.75 185.75 0 0 1-94.36-25.72l-6.77-4-70.17 18.32 18.73-68.09-4.41-7A183.46 183.46 0 0 1 71.53 254c0-101.73 83.21-184.5 185.48-184.5a185 185 0 0 1 185.33 184.64c-.04 101.74-83.21 184.52-185.4 184.52zm101.69-138.19c-5.57-2.78-33-16.2-38.08-18.05s-8.83-2.78-12.54 2.78-14.4 18-17.65 21.75-6.5 4.16-12.07 1.38-23.54-8.63-44.83-27.53c-16.57-14.71-27.75-32.87-31-38.42s-.35-8.56 2.44-11.32c2.51-2.49 5.57-6.48 8.36-9.72s3.72-5.56 5.57-9.26.93-6.94-.46-9.71-12.54-30.08-17.18-41.19c-4.53-10.82-9.12-9.35-12.54-9.52-3.25-.16-7-.2-10.69-.2a20.53 20.53 0 0 0-14.86 6.94c-5.11 5.56-19.51 19-19.51 46.28s20 53.68 22.76 57.38 39.3 59.73 95.21 83.76a323.11 323.11 0 0 0 31.78 11.68c13.35 4.22 25.5 3.63 35.1 2.2 10.71-1.59 33-13.42 37.63-26.38s4.64-24.06 3.25-26.37-5.11-3.71-10.69-6.48z"></path></svg>
        </i></a>
      </div>
    </div>
 
 
    {/* <!------------------- RIGHT PANEL =------------------> */}
    <div>
      <div className="right-header">
        <p className="right-title">Contact channels</p>
        <p className="right-sub">Pick the channel that works best for you</p>
      </div>
 
      <a href="tel:+234 814 580 1171" className="contact-card">
        <div className="contact-card-icon"><i className="ti ti-phone"></i></div>
        <div>
          <p className="contact-card-label">Phone</p>
          <p className="contact-card-value">+234 814 580 1171</p>
        </div>
        <i className="ti ti-arrow-right contact-card-arrow"></i>
      </a>

      <a href="mailto:richardtls651@gmail.com" className="contact-card">
        <div className="contact-card-icon"><i className="ti ti-mail"></i></div>
        <div>
          <p className="contact-card-label">Email</p>
          <p className="contact-card-value">richardtls651@gmail.com</p>
        </div>
        <i className="ti ti-arrow-right contact-card-arrow"></i>
      </a>

      <a href="https://wa.me/234 814 580 1171" className="contact-card" target="_blank">
        <div className="contact-card-icon"><i className="ti ti-brand-whatsapp"></i></div>
        <div>
          <p className="contact-card-label">WhatsApp</p>
          <p className="contact-card-value">Message on WhatsApp</p>
        </div>
        <i className="ti ti-arrow-right contact-card-arrow"></i>
      </a>

      <a href="https://maps.google.com/?q=Pentagon+Hotel+and+suites+choba,Port+Harcourt,Rivers+State,Nigeria" className="contact-card" target="_blank">
        <div className="contact-card-icon"><i className="ti ti-map-pin"></i></div>
        <div>
          <p className="contact-card-label">Location</p>
          <p className="contact-card-value">Pentagon Choba,Port Harcourt, Rivers State</p>
        </div>
        <i className="ti ti-arrow-right contact-card-arrow"></i>
      </a>      <div className="cta-block">
        <p className="cta-title">Prefer a scheduled call?</p>
        <p className="cta-sub">Book a free 30-minute discovery session at a time that suits you.</p>
        <a href="mailto:edachemorgan10@gmail.com?subject=Book%20a%20Call%20-%20Discovery%20Session&body=Hi%20Morgan,%0A%0AI%20would%20like%20to%20book%20a%2030-minute%20discovery%20session.%0A%0APlease%20let%20me%20know%20your%20availability.%0A%0AThanks!" className="cta-btn">
          <i className="ti ti-calendar"></i>
          Book a call
        </a>
      </div>
    </div>
 
  </div>
</section>
        </React.Fragment>
  )
}

export default Contact