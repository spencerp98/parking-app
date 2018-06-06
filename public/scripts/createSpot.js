let btn = document.getElementById('btn');

btn.addEventListener('click', function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(createSpot);
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
});

function createSpot(position) {
    let d = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    let params = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        date: d
        };
        
    post('/nav', params);
}

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

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