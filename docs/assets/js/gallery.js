function gallery_curr_rgn() {
  return $("#gallery-region option:selected").first().val()
}
function gallery_curr_sort_mode() {
  return $("#gallery-sort-by option:selected").first().val()
}

jQuery(document).ready(function( $ ){

load_gallery(null, null)

$('#gallery-region').selectmenu({
  change: function( event, data ) {
    let rgn = data.item.value
    load_gallery(rgn, gallery_curr_sort_mode())
  }
});

$('#gallery-sort-by').selectmenu({
  change: function( event, data ) {
    let sort_mode = data.item.value
    load_gallery(gallery_curr_rgn(), sort_mode)
  }
});

$('#gallery-reload').each(function(){
  $(this).click(function(){
    load_gallery(gallery_curr_rgn(), gallery_curr_sort_mode())
  });
});

})

function load_gallery(rgn, sort_mode) {
  container = $(".gallery-pagination")

  container.prev().html(loading_spinner_html)

  load_journey(arr => {
    if (rgn != "all" && rgn != null) {
      arr = arr.filter(d => { return d.rgn == rgn })
    }

    if (sort_mode == "latest-top") {
      arr.sort(function (a, b) { return b.dat.localeCompare(a.dat) })
    }
    else if (sort_mode == "earliest-top") {
      arr.sort(function (a, b) { return a.dat.localeCompare(b.dat) })
    }
    else {
      shuffle_array(arr)
    }

    container.pagination({
      dataSource: arr,
      pageSize: 6,
      showGoInput: true,
      showGoButton: true,
      callback: function(data, pagination) {
        s = pagination.pageSize
        n = pagination.pageNumber

        var items = []
        data.forEach(d => {
          html = article_html(d, "wide-cell")
          items.push(html)
        })

        html = items.join("")
        container.prev().html(html);

        setTimeout(function() {
          $(".gallery .cell").addClass("show");
        }, 10);
      }
    })
  })
}
