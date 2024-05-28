var configs;
var domain;

function send_to_tab(subject, fn=null) {
	browser.tabs.query({
		active: true,
		currentWindow: true
	}, tabs => {
		browser.tabs.sendMessage(
			tabs[0].id,
			{from: "popup", subject: subject},
			fn
		);
	});
}

function update_configs() {
	browser.storage.local.set(configs).then((value) => {
		send_to_tab("updateConfigs");
	});
}

function set_togglebtn_label() {
	let label = "Turn On";
	let logo = document.getElementById("logo");

	if(configs.enabled){
		label = "Turn Off";
		logo.classList.remove("disabled");
	}else{
		logo.classList.add("disabled");
	}

	document.getElementById("togglebtn").value = label;
}

function set_listbtn_label() {
	let label = "Add to list";
	let index = configs.blacklist.indexOf(domain);

	if(index != -1){
		label = "Remove from list";
	}
	
	document.getElementById("listbtn").value = label;
}

function set_list_type_button() {
	let blacklist = document.getElementById("blacklist");
	let whitelist = document.getElementById("whitelist");
	
	if(!configs.whitelist){
		blacklist.checked = true;
	}else{
		whitelist.checked = true;
	}
}

function set_list_type() {
	let blacklist = document.getElementById("blacklist");

	configs.whitelist = !blacklist.checked;

	update_configs();
}

function toggle_enable() {
	configs.enabled = !configs.enabled;
	set_togglebtn_label();
	
	update_configs();
}

function toggle_list() {
	let index = configs.blacklist.indexOf(domain);
	
	if(index != -1){
		configs.blacklist.splice(index, 1);
	}else{
		configs.blacklist.push(domain)
	}
	set_listbtn_label();
	
	browser.storage.local.set(configs).then((value) => {
		send_to_tab("updateConfigs");
	});
}

function init(r){
	configs = r[0];
	domain = r[1];

	// Set domain name label
	if(domain !== undefined){
		document.getElementById("domain").value = domain;
		// Set list button label
		set_listbtn_label();
		document.getElementById("listbtn").disabled = false;
	}
	
	// Set on/off button label
	set_togglebtn_label();
	document.getElementById("togglebtn").disabled = false;
	
	// Set list type radio button
	set_list_type_button();
	
	// Add event listener on buttons
	document.getElementById("togglebtn").addEventListener("click", (event) => {
		toggle_enable();
	});
	document.getElementById("blacklist").addEventListener("change", (event) => {
		set_list_type();
	});
	document.getElementById("whitelist").addEventListener("change", (event) => {
		set_list_type();
	});
	document.getElementById("listbtn").addEventListener("click", (event) => {
		toggle_list();
	});
}

window.addEventListener('DOMContentLoaded', () => {
	send_to_tab("init", init)
});
