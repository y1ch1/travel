let Y1_BASE_URL = "https://yichiandscratchy.com"
let Y1_JM_PLACES_URL = `${Y1_BASE_URL}/jm/places.json`

function shuffle_array(o) {
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x){};
  return o;
}

function compare_sets(as, bs) {
  as = (as != null) ? as : new Set()
  bs = (bs != null) ? bs : new Set()
  if (as.size !== bs.size) return false;
  for (var a of as) if (!bs.has(a)) return false;
  return true;
}

function jm_img_url_l(id, img_name) {
  return `${Y1_BASE_URL}/assets/img/jm/l/${id}/${img_name}`
}

function jm_img_url_s(id, img_name) {
  return `${Y1_BASE_URL}/assets/img/jm/s/${id}/${img_name}`
}

function loading_spinner_html() {
  return `
<div class="loading">
<p>
<i class="fa fa-spin fa-sync-alt fa-lg"></i>
<span>Loading...</span>
</p>
</div>`
}

function article_html(d, extra_classes) {
  url = jm_img_url_s(d.id, d.img_name)

  return `
<div class="cell anim-fade ${extra_classes}">
<a href="${Y1_BASE_URL}/loc/${d.id}/" target="_blank">
<div class="div" style="background-image:url(${url})">
<h2><span>${d.name}</span></h2>
</div>
</a>
</div>`
}

function related_html(d) {
  url = jm_img_url_s(d.id, d.img_name)

  return `
<a href="${Y1_BASE_URL}/loc/${d.id}/" class="item anim-fade flex items-center">
<div class="bg" style="background-image:url(${url})"></div>
<span>${d.name}</span>
</a>`
}

function convert_jm_item_to_obj(dict) {
  props = dict["properties"]
  coords = dict["geometry"]["coordinates"]

  return {
    id: props["id"],
    name: props["c"],
    dat: props["dat"],
    img_name: props["img"],
    rgn: props["rgn"],
    lat: coords[1],
    lng: coords[0],
  }
}

function load_journey(callback) {
  $.getJSON(Y1_JM_PLACES_URL, data => {
    mapped_data = data["features"].map(convert_jm_item_to_obj)

    callback(mapped_data)
  })
}

function load_content({
    will_load, prepare_data, process_item, on_success, on_error
}) {

  will_load()

  $.getJSON(Y1_JM_PLACES_URL, data => {
    var items = [];

    mapped_data = data["features"].map(convert_jm_item_to_obj)

    flags = {
      abort: false
    }
    arr = prepare_data(mapped_data, flags)

    if (flags.abort) {
      return
    }
    if (arr.length < 1) {
      on_error()
      return
    }

    arr.forEach(d => {
      html = process_item(d)
      items.push(html)
    })

    html = items.join("")
    on_success(html)
  });
}
