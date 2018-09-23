/*
  Gallery
 */
map_last_visible_set = null

function update_gallery() {
  let container = $(".gallery")

  let wrapper_beg = `<div class="flex items-center justify-center h-screen"><div class="text-center">`
  let wrapper_end = `</div></div>`

  load_content({
    will_load: () => {
      if (map_last_visible_set == null) {
        h = wrapper_beg
        h += loading_spinner_html()
        h += wrapper_end

        container.html(h)
      }
    },
    prepare_data: (arr, flags) => {
      b = mymap.getBounds()

      filtered = shuffle_array(arr).filter(i => {
        return b.contains({lat: i.lat, lng: i.lng})
      })

      filtered_set = new Set(filtered.map(i => {
        return i.id
      }))

      if (compare_sets(filtered_set, map_last_visible_set)) {
        flags.abort = true
        return []
      }

      map_last_visible_set = filtered_set

      return filtered.slice(0, 6)
    },
    process_item: d => {
      return article_html(d, "home-cell")
    },
    on_success: () => {
      container.html(html)

      setTimeout(function() {
        $(".gallery .cell").addClass("show");
      }, 10)
    },
    on_error: () => {
      h = wrapper_beg
      h += `
<i class="fas fa-exclamation-triangle fa-7x"></i>
<h2>No data</h2>
<h3 class="mt-2">Try moving the map to a different area</h3>`
      h += wrapper_end

      container.html(h)
    }
  })
}

jQuery(document).ready(function( $ ){
  /*
    Map
   */
  load_map({
    show_img: false,
    fixed_width: false
  })

  mymap.on('moveend', function() {
    update_gallery()
  });

  mymap.on('zoomend', function() {
    update_gallery()
  });

  update_gallery()
});
