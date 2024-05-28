var running = false;
var styleSheet=document.createElement("style");
styleSheet.type="text/css";
styleSheet.innerText=`
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

function main(conf) {
	configs = conf;
	let domain = window.location.hostname;

	if (
		configs.enabled &&
		(
			(!configs.whitelist && !configs.blacklist.includes(domain)) ||
			(configs.whitelist && configs.blacklist.includes(domain))
		)
	) {
		if(!running){ // If enabled and not running
			// Enable
			document.head.appendChild(styleSheet);
			running = !running;
		}
	} else {
		if(running){ // If not enabled and running
			// Disable
			document.head.removeChild(styleSheet);
			running = !running;
		}
	}
}

var configs = {
	"enabled": true,
	"blacklist": [],
	"whitelist":false,
};
browser.storage.local.get(configs).then(main);

browser.runtime.onMessage.addListener((msg, sender, response) => {
	if (msg.from === "popup") {
		if (msg.subject === "init") {
			response([configs, window.location.hostname]);
		} else if (msg.subject === "updateConfigs") {
			browser.storage.local.get(configs).then(main);
		}
	}
});
