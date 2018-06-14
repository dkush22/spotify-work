document.addEventListener("DOMContentLoaded", function() {

var container = document.querySelector('#container')
const	h1 = document.createElement('h1')
const	img = document.createElement('img')
const   h3_1 = document.createElement('h3')
const	h3_2 = document.createElement('h3')
const	link = document.createElement('a')
const	button = document.createElement('button')

// get auth token from https://github.com/spotify/web-api-auth-examples. Follow instructions for Authorization Code flow
// place auth token below in var authToken

var authToken = ''
var myHeaders = new Headers({
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'Authorization': 'Bearer ' + authToken
})

let fetchData = { 
    headers: myHeaders
}

container.addEventListener('click', addChange)
container


// gets event from buttons and either calls function to repopulate with a new artist or plays one of the tracks
function addChange() {

if (event.target.nodeName.toLowerCase() === 'button' && event.target.className === 'populate artists') {
		repopulateNewArtist(event.target.id)
	}

else if (event.target.nodeName.toLowerCase() === 'button' && event.target.className === 'play-buttons') {
	playTracks(event.target.id)
}

}


// initial population of site with Adele info
function populateAdele() {
fetch('https://api.spotify.com/v1/artists/4dpARuHxo51G3z768sgnrY', fetchData)
.then((resp) => resp.json())
.then(function(data) {
	container.append(h3_1)
	container.append(img)
	container.append(h3_2)
	container.append(link)
	container.append(button)
    h3_1.innerText = 'Artist Name: ' + data.name
    img.src = data.images[0]['url']
    h3_2.innerText = 'Followers: ' + data.followers['total']
    link.append(button)
    link.href = data.external_urls['spotify']
    button.innerText = 'Open Spotify Link'
    relatedArtists()
    topTracks()
});
}

// initial population of Adele's related artists 
function relatedArtists() {
	fetch('https://api.spotify.com/v1/artists/4dpARuHxo51G3z768sgnrY/related-artists', fetchData)
	.then((resp) => resp.json())
	.then(function(data) {
		let artists = data.artists
		var div = document.createElement('div')
		div.id = 'related-artists-div'
		var h3 = document.createElement('h3')
		div.appendChild(h3)	
		h3.innerText = 'Related Artists'
		artists.map(function(artist) {
		var   li = document.createElement('li')
		var   relatedImg = document.createElement('img')
		var relatedButton = document.createElement('button')
		relatedButton.innerText = 'Populate ' + artist.name
		relatedButton.id = artist.href
		relatedButton.className = 'populate artists'
		li.innerText = artist.name
		relatedImg.src = artist.images[0]['url']
		relatedImg.id = 'related-artist-image'
		div.appendChild(li)
		li.appendChild(relatedImg)
		li.appendChild(relatedButton)
		container.appendChild(div)
		})
	});
}

// initial population of Adele's top tracks
function topTracks() {
	fetch('https://api.spotify.com/v1/artists/4dpARuHxo51G3z768sgnrY/top-tracks?country=US', fetchData)
	.then((resp) => resp.json())
	.then(function(data) {
		let tracks = data.tracks
		var div = document.createElement('div')
		div.id = 'tracks-div'
		var h3 = document.createElement('h3')
		h3.innerText = 'Top Tracks (Max 10)'
		div.appendChild(h3)	
		tracks.slice(0, 10).map(function(track) {
		var   li = document.createElement('li')
		var trackButton = document.createElement('button')
		trackButton.innerText = 'Play Clip'
		trackButton.id = track.preview_url
		trackButton.className = 'play-buttons'
		li.innerText = track.name	
		div.appendChild(li)
		li.appendChild(trackButton)
		container.appendChild(div)
		})
	});
}

// repopulates page with new artist's information
function repopulateNewArtist(url) {
container.innerHTML = ''
fetch(url, fetchData)
.then((resp) => resp.json())
.then(function(data) {
	container.append(h3_1)
	container.append(img)
	container.append(h3_2)
	container.append(link)
	container.append(button)
    h3_1.innerText = 'Artist Name: ' + data.name
    img.src = data.images[0]['url']
    h3_2.innerText = 'Followers: ' + data.followers['total']
    link.append(button)
    link.href = data.external_urls['spotify']
    button.innerText = 'Open Spotify Link'
    repopulateRelatedArtists(url)
    repopulateTopTracks(url)
});
}

// repopulates page with new artist's related artists. If no related artists are found, it calls on the function to repopulate Adele
function repopulateRelatedArtists(url) {
	fetch(url + '/related-artists', fetchData)
	.then((resp) => resp.json())
	.then(function(data) {
		let artists = data.artists
		var div = document.createElement('div')
		div.id = 'related-artists-div'
		var h3 = document.createElement('h3')
		div.appendChild(h3)	
		h3.innerText = 'Related Artists'
		artists.map(function(artist) {
		var   li = document.createElement('li')
		var   relatedImg = document.createElement('img')
		var relatedButton = document.createElement('button')
		relatedButton.innerText = 'Populate ' + artist.name
		relatedButton.id = artist.href
		relatedButton.className = 'populate artists'
		li.innerText = artist.name
		relatedImg.src = artist.images[0]['url']
		relatedImg.id = 'related-artist-image'
		div.appendChild(li)
		li.appendChild(relatedImg)
		li.appendChild(relatedButton)
		container.appendChild(div)
		})
	})
	.catch(function() {
		repopulateAdele()
	});
}

// repopulates page with new artist's top tracks
function repopulateTopTracks(url) {
	fetch(url + '/top-tracks?country=US', fetchData)
	.then((resp) => resp.json())
	.then(function(data) {
		let tracks = data.tracks
		var div = document.createElement('div')
		div.id = 'tracks-div'
		var h3 = document.createElement('h3')
		h3.innerText = 'Top Tracks (Max 10)'
		div.appendChild(h3)	
		tracks.slice(0, 10).map(function(track) {
		var   li = document.createElement('li')
		var trackButton = document.createElement('button')
		trackButton.innerText = 'Play Clip'
		trackButton.id = track.preview_url
		trackButton.className = 'play-buttons'
		li.innerText = track.name	
		div.appendChild(li)
		li.appendChild(trackButton)
		container.appendChild(div)
		})
	});
}

// if no related artists are found, repopulates page with Adele with message saying no related artists were found
function repopulateAdele() {
container.innerHTML = ''
fetch('https://api.spotify.com/v1/artists/4dpARuHxo51G3z768sgnrY', fetchData)
.then((resp) => resp.json())
.then(function(data) {
	container.append(h1)
	container.append(h3_1)
	container.append(img)
	container.append(h3_2)
	container.append(link)
	container.append(button)
	h1.innerText = 'We are sorry. There were no related artists.'
    h3_1.innerText = 'Artist Name: ' + data.name
    img.src = data.images[0]['url']
    h3_2.innerText = 'Followers: ' + data.followers['total']
    link.append(button)
    link.href = data.external_urls['spotify']
    button.innerText = 'Open Spotify Link'
    relatedArtists()
});
}


// plays 30 second clip of artist's top tracks
function playTracks(url) {
	if (!document.getElementById('frame-songs')) {
		var songDiv = document.createElement('div')
		var songFrame = document.createElement('IFRAME')
		songDiv.id = 'frame-songs'
		songFrame.src = url
		songDiv.appendChild(songFrame)
		container.appendChild(songDiv)
	}

	else {
		var songDiv = document.getElementById('frame-songs')
		songDiv.innerHTML = ''
		var songFrame = document.createElement('IFRAME')
		songFrame.src = url
		songDiv.appendChild(songFrame)

	}
}

populateAdele()
})