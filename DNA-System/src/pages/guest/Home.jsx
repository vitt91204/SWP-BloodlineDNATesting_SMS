import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const services = [
    {
      id: 1,
      title: 'DNA Paternity Testing',
      description: 'Accurate and confidential paternity testing with 99.99% accuracy',
      icon: 'bi bi-activity',
      price: 'From $299'
    },
    {
      id: 2,
      title: 'Ancestry DNA Testing',
      description: 'Discover your genetic heritage and connect with relatives',
      icon: 'bi bi-tree',
      price: 'From $199'
    },
    {
      id: 3,
      title: 'Genetic Health Screening',
      description: 'Comprehensive genetic health risk assessment',
      icon: 'bi bi-heart-pulse',
      price: 'From $399'
    }
  ];

  const features = [
    {
      icon: 'bi bi-shield-check',
      title: 'Accredited Laboratory',
      description: 'ISO certified facilities with state-of-the-art equipment'
    },
    {
      icon: 'bi bi-clock',
      title: 'Fast Results',
      description: '3-5 business days turnaround time for most tests'
    },
    {
      icon: 'bi bi-lock',
      title: 'Privacy Guaranteed',
      description: 'Your data is protected with industry-leading security'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold mb-4">DNA Testing Services</h1>
              <p className="lead mb-4">
                Discover the power of genetic testing with our comprehensive DNA analysis services.
                Professional, confidential, and accurate results guaranteed.
              </p>
              <div className="d-grid gap-2 d-md-flex">
                <Link to="/booking" className="btn btn-light btn-lg px-4">
                  Book a Test
                </Link>
                {!isAuthenticated && (
                  <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                    Register Now
                  </Link>
                )}
              </div>
            </div>
            <div className="col-md-6 d-none d-md-block">
              {/* Add an illustration or image here */}
              <img 
                src="/images/dna-illustration.svg" 
                alt="DNA Testing" 
                className="img-fluid"
                onError={(e) => e.target.style.display = 'none'} // Fallback if image doesn't exist
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Our Services</h2>
          <div className="row g-4">
            {services.map(service => (
              <div key={service.id} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <i className={`${service.icon} fs-1 text-primary mb-3`}></i>
                    <h5 className="card-title">{service.title}</h5>
                    <p className="card-text text-muted">{service.description}</p>
                    <p className="fw-bold text-primary">{service.price}</p>
                    <Link to="/booking" className="btn btn-outline-primary">
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose Us</h2>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-4">
                <div className="text-center">
                  <i className={`${feature.icon} fs-1 text-primary mb-3`}></i>
                  <h5>{feature.title}</h5>
                  <p className="text-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h2 className="mb-4">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Book your DNA test today or contact us for more information about our services.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <Link to="/booking" className="btn btn-primary btn-lg px-4">
                  Book Now
                </Link>
                <a href="tel:1234567890" className="btn btn-outline-primary btn-lg px-4">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
