let btn = document.getElementById('btn');

btn.addEventListener('click', function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(createSpot);
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
});

function createSpot(position) {
    // let formData = new FormData();
    
    // // location
    // formData.append("lat", position.coords.latitude);
    // formData.append("lng", position.coords.longitude);
    
    // // date
    // let d = new Date();
    // formData.append("date", d);
    
    // // submit
    // let request = new XMLHttpRequest();
    // request.open("POST", "/nav");
    // request.send(formData);
    
    let d = new Date();
    
    let params = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        date: d
        };
        
    post('/nav', params);
}

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}