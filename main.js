var css=`
@keyframes avoidghost {
	0% {transform: translate(0,0);}
	25% {transform: translate(.5vh,.5vh);}
	50% {transform: translate(0,.5vh);}
	75% {transform: translate(.5vh,0)}
	100% {transform: translate(0,0);}
}
body {
	animation-name: avoidghost;
	animation-iteration-count: infinite;
	animation-duration: 10s;
}
`;

var styleSheet=document.createElement("style");
styleSheet.type="text/css";
styleSheet.innerText=css;

document.head.appendChild(styleSheet);