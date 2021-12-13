import React from 'react';
import Resolution from '@unstoppabledomains/resolution';
import { NftGallery } from 'react-nft-gallery';

import './css/Search.css';
import logo from './img/uds180.png';

class Search extends React.Component {
  constructor(props) {
    super(props);
	
    this.state = { domain: "",
	               address: "",
                   error: false,
                   lookup: false,
                   searched: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	this.handleCleanup = this.handleCleanup.bind(this);
	this.displayLookup = this.displayLookup.bind(this)
	this.displayGallery = this.displayGallery.bind(this);
	this.displayError = this.displayError.bind(this);
	this.resolve = this.resolve.bind(this);
  }

  /*///////////////////////
   *   Search functions 
   *///////////////////////
  handleChange(event) {
    this.setState({domain: event.target.value});
	this.setState({address: ''});
	this.setState({lookup: false});
	this.domain = event.target.value;
  }
  
  handleCleanup = () => {
    const elements = document.getElementsByClassName('rnftg-item');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
  }
  
  handleSubmit(event) {
	this.handleCleanup();
	this.setState({searched: true});
	this.setState({lookup: true});
	this.resolve(this.domain);
    event.preventDefault();
  }
  
  /*///////////////////////
   *   Display functions 
   *///////////////////////
  displayGallery = () => {
	if (this.state.searched) { 
	  return ( 
	    <>
		  <hr style={{margin: "0 1.5em 0 1.5em"}}/>
	      <div id="gallery"><NftGallery ownerAddress={this.state.address} /></div>
		  
	    </>
      );
	}
  }
  
  displayError = () => {
	if (this.state.error) {
	  return (
	    <>
	      <div className="error-wrapper">
		    <h1>Uh-oh!</h1>
			<h2>That domain is not registered with Unstoppable</h2>
		  </div>
		</>
	  );
	}
  }
  
  displayLookup = () => {
	const etherlink = 'https://etherscan.io/address/' + this.state.address;
	
    if (this.state.lookup && !this.state.error) {
	  return (
	    <>
		  <ul className="lookup-wrapper">
		    <li>
			  <span className="lookup-title">Domain </span>
			  <span className="lookup-content">{this.domain}</span>
			</li>
			<li>
			  <span className="lookup-title">Address</span>
			  <span className="lookup-content">{this.state.address}</span>
			</li>
			<li className="lookup-es">
			  <a href={etherlink} target="_blank" rel="noreferrer" className="lookup-esa">View on Etherscan</a>
			</li>
		  </ul>
		</>
	  );
	}
  }
  
  displayDesc = () => {
    if (!this.state.searched || this.state.error) {
	  return (
	    <>
		  <p className="description">
		  This application was built for the "Login with Unstoppable" Gitcoin hackathon
		  </p>
		</>
	  );
	}
  }
  
  /*///////////////////////
   *   Resolve function
   *///////////////////////
  resolve = (domain) => {
    let resolution = new Resolution({ blockchain: {
      uns: {
        url: "https://mainnet.infura.io/v3/12351245223",
        network: "mainnet"
      }
    }});
	
	resolution.isRegistered(domain).then((result) => {
		if (result) {
			this.setState({error: false});
			resolution.addr(domain, "eth")
	                  .then(addr => this.setState({address: addr}));
		} else {
			// popup error?
			this.setState({error: true});
		}
	});
    
  }
  
  /*///////////////////////
  *   Search return
  *///////////////////////
	render() { 
		return (
		<div className="form-wrapper">
		  <form className="search-form" onSubmit={this.handleSubmit}>
		    <div className="search-wrapper">
			  <ul className="search-header">
			    <li><img className="" src={logo} alt="logo"/></li>
			    <li><h1>UDSea</h1></li>
				<hr style={{margin: "1.5em 15em 0 15em"}}/>
				<li className="search-desc"><h2>Sail the blockchain for other users NFT collections by searching their Unstoppable Domains address</h2></li>
		      </ul>
			  
			  <input type="text" className="search-bar" placeholder="Domain address..." value={this.state.domain} onChange={this.handleChange} />
			  <input type="submit" className="search-btn" value="Search" />
			</div>
			
			{ this.displayError() }
			{ this.displayLookup() }
			{ this.displayGallery() }
			{ this.displayDesc() }
		  </form>
		</div>
		);
	}
	
}
export default Search;