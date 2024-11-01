/* 
jshint devel:true
global Vue 
global UltimateDoc 
global wp 
global swal 
global ajaxurl
 */

function udTabs(evt, className) {
  evt.preventDefault();
  // Declare all variables
  var i, tabcontent, tablinks;

  document.getElementById('ultd--settings').setAttribute('data-tab', className);
  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("ultd--tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("ultd--tab-link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(className).style.display = "block";
  evt.currentTarget.className += " active";

}


Vue.directive("click-outside", {
  bind(el, binding, vnode) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});

Vue.directive('sortable', {
  bind: function (el, binding) {
    var $el = jQuery(el);

    $el.sortable({
      items: '> li',
      connectWith: ".sections",


      stop: function (event, ui) {
        var ids = [];

        jQuery(ui.item.closest('ul'))
          .children('li')
          .each(function (index, el) {
            ids.push(jQuery(el).data('id'));
          });

        wp.ajax.post({
          action: 'ultd__sortable_docs',
          ids: ids,
          _wpnonce: UltimateDoc.nonce,
        });
      },
      cursor: 'move',
      // connectWith: ".connectedSortable"
    }).disableSelection();;
  },
});



new Vue({
  el: '#ultd--app',
  data: {
    editurl: '',
    viewurl: '',
    docs: [],
  },

  mounted: function () {
    var self = this,
      dom = jQuery(self.$el);

    this.editurl = UltimateDoc.editurl;
    this.viewurl = UltimateDoc.viewurl;

    dom.find('ul.docs').removeClass('not-loaded').addClass('loaded');

    jQuery.get(
      ajaxurl, {
        action: 'ultd__admin_get_docs',
        _wpnonce: UltimateDoc.nonce,
      },
      function (data) {
        dom.find('.spinner').remove();
        dom.find('.ultd--no-docs').removeClass('not-loaded');

        self.docs = data.data;


      }
    );


  },

  methods: {
    onError: function (error) {
      alert(error);
    },

    swalInputValidator: function (value) {
      if (!value) {
        return 'You need to write something';
      }
    },

    addDoc: function () {
      var that = this;
      this.docs = this.docs || [];

      Swal.fire({
        title: UltimateDoc.enter_doc_title,
        input: 'text',
        showCancelButton: true,
        inputPlaceholder: UltimateDoc.write_something,
        confirmButtonText: UltimateDoc.confirmBtn,
        cancelButtonText: UltimateDoc.cancelBtn,
        inputValidator: this.swalInputValidator,
        customClass: 'ultd__form_modal'
      }).then(function (input) {
        if (input.isDismissed) {
          return;
        }

        wp.ajax.send({
          data: {
            action: 'ultd__create_doc',
            title: input.value.trim(),
            parent: 0,
            _wpnonce: UltimateDoc.nonce,
          },
          success: function (res) {
            that.docs.unshift(res);
          },
          error: this.onError,
        });
      });
    },

    copyDoc: function (post) {


      wp.ajax.send({
        data: {
          action: 'ultd__duplicate_doc',
          post_id: post.post.id,
          parent: 0,
          _wpnonce: UltimateDoc.nonce,
        },
        success: function (res) {
          // that.docs.unshift(res);
        },
        error: this.onError,
      });

    },

    removeDoc: function (doc, docs) {
      var self = this;
      var delete_icon = '<svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M21.3333 6.33333L20.1769 22.5233C20.0772 23.9188 18.916 25 17.517 25H6.48296C5.08393 25 3.92275 23.9188 3.82307 22.5233L2.66665 6.33333M9.33331 11.6667V19.6667M14.6666 11.6667V19.6667M16 6.33333V2.33333C16 1.59695 15.403 1 14.6666 1H9.33331C8.59693 1 7.99998 1.59695 7.99998 2.33333V6.33333M1.33331 6.33333H22.6666" stroke="#A1A1AA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      Swal.fire({
        title: delete_icon + 'Are you sure?',
        text: 'Are you sure to delete the entire documentation? Sections and articles inside this doc will be deleted too!',
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F54343',
        confirmButtonText: UltimateDoc.delConfirmBtn,
        cancelButtonText: UltimateDoc.cancelBtn,
        customClass: 'ultd__alert ultd__alert_delete'
      }).then(function (action) {
        if (action.isConfirmed) {
          self.removePost(doc, docs, 'The doc has been deleted.');
        }
      });
    },

    addSection: function (doc) {
      Swal.fire({
        title: UltimateDoc.enter_section_title,
        input: 'text',
        showCancelButton: true,
        // confirmButtonColor: '#2271b1',
        inputPlaceholder: UltimateDoc.write_something,
        confirmButtonText: UltimateDoc.confirmBtn,
        cancelButtonText: UltimateDoc.cancelBtn,
        customClass: 'ultd__form_modal',
        inputValidator: this.swalInputValidator,
      }).then(function (input) {
        if (input.isDismissed) {
          return;
        }

        if (input.value) {
          wp.ajax.send({
            data: {
              action: 'ultd__create_doc',
              title: input.value.trim(),
              parent: doc.post.id,
              order: doc.child.length,
              _wpnonce: UltimateDoc.nonce,
            },
            success: function (res) {
              doc.child.push(res);
            },
            error: this.onError,
          });
        }
      });
    },

    removeSection: function (section, sections) {
      var self = this;
      var delete_icon = '<svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M21.3333 6.33333L20.1769 22.5233C20.0772 23.9188 18.916 25 17.517 25H6.48296C5.08393 25 3.92275 23.9188 3.82307 22.5233L2.66665 6.33333M9.33331 11.6667V19.6667M14.6666 11.6667V19.6667M16 6.33333V2.33333C16 1.59695 15.403 1 14.6666 1H9.33331C8.59693 1 7.99998 1.59695 7.99998 2.33333V6.33333M1.33331 6.33333H22.6666" stroke="#A1A1AA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      Swal.fire({
        title: delete_icon + UltimateDoc.delConfirm,
        text: UltimateDoc.delConfirmTxt,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F54343',
        confirmButtonText: UltimateDoc.delConfirmBtn,
        cancelButtonText: UltimateDoc.cancelBtn,
        customClass: 'ultd__alert ultd__alert_delete'
      }).then(function (action) {
        if (action.isDismissed) {
          return;
        }

        if (action.isConfirmed) {
          self.removePost(section, sections);
        }
      });
    },

    addArticle: function (section, event) {
      var parentEvent = event;

      Swal.fire({
        title: UltimateDoc.enter_doc_title,
        input: 'text',
        showCancelButton: true,
        inputPlaceholder: UltimateDoc.write_something,
        confirmButtonText: UltimateDoc.confirmBtn,
        cancelButtonText: UltimateDoc.cancelBtn,
        customClass: 'ultd__form_modal',
        inputValidator: this.swalInputValidator,
      }).then(function (input) {
        if (input.isDismissed) {
          return;
        }

        if (input.value === false || input.value === '') {
          return false;
        }

        wp.ajax.send({
          data: {
            action: 'ultd__create_doc',
            title: input.value,
            parent: section.post.id,
            status: 'draft',
            order: section.child.length,
            _wpnonce: UltimateDoc.nonce,
          },
          success: function (res) {
            section.child.push(res);

            var articles = jQuery(parentEvent.target)
              .closest('.section-title')
              .next();

            if (articles.hasClass('collapsed')) {
              articles.removeClass('collapsed');
            }
          },
          error: function (error) {
            alert(error);
          },
        });
      });
    },

    quickEdit: function (doc, event) {
      var parentEvent = event;

      Swal.fire({
        title: UltimateDoc.quickedit,
        html: '<label class="swal2-input-label" for="ultd--input-title">' + UltimateDoc.title + '</label><input name="ultd--input-title" id="ultd--input-title" class="swal2-input" value="' + doc.post.title + '">' +
          '<label class="swal2-input-label" for="ultd--input-slug">' + UltimateDoc.slug + '</label><input name="ultd--input-slug" id="ultd--input-slug" class="swal2-input" value="' + doc.post.slug + '"> ',
        showCancelButton: true,
        confirmButtonText: UltimateDoc.confirmBtn,
        cancelButtonText: UltimateDoc.cancelBtn,
        customClass: 'ultd__form_modal',
        inputValidator: this.swalInputValidator,
      }).then(function (input) {
        if (input.isDismissed) {
          return;
        }

        if (input.value === false || input.value === '') {
          return false;
        }
        var updatedTitle = document.getElementById('ultd--input-title').value,
          updatedSlug = document.getElementById('ultd--input-slug').value

        wp.ajax.send({
          data: {
            action: 'ultd__quick_edit',
            title: updatedTitle,
            slug: updatedSlug,
            post_id: doc.post.id,
            status: 'publish',
            order: doc.child.length,
            _wpnonce: UltimateDoc.nonce,
          },
          success: function (res) {
            var articles = jQuery(parentEvent.target).parents('.ultd--row-actions')
              .siblings('a').find('.ultd--title')
            articles.text(updatedTitle);

            doc.post.title = updatedTitle
            doc.post.slug = updatedSlug

            var success_icon = '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 13L11.6667 15.6667L17 10.3333M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

            Swal.fire({
              title: success_icon + 'Successfully Updated!',
              text: 'You can always change this again if needed.',              
              customClass: 'ultd__alert ultd__alert_success',
              confirmButtonText: 'Go Back',
            });
            // if (articles.hasClass('collapsed')) {
            //   articles.removeClass('collapsed');
            // }
          },
          error: function (error) {
            alert(error);
          },
        });
      });
    },

    showCondition: function (doc, event) {
      var parentEvent = event
      that = this;

      Swal.fire({
        title: UltimateDoc.quickedit,
        html: '<label class="swal2-input-label" for="include_pages">' + UltimateDoc.include_title + '</label>' + doc.post.include_pages +
          '<label class="swal2-input-label" for="exclude_pages">' + UltimateDoc.exclude_title + '</label>' + doc.post.exclude_pages,
        showCancelButton: true,
        confirmButtonText: UltimateDoc.confirmBtn,
        cancelButtonText: UltimateDoc.cancelBtn,
        customClass: 'ultd__form_modal',
        inputValidator: this.swalInputValidator,
      }).then(function (input) {
        if (input.isDismissed) {
          return;
        }

        if (input.value === false || input.value === '') {
          return false;
        }

        var include_ids = jQuery('#include_pages_' + doc.post.id + '').val(),
          exclude_ids = jQuery('#exclude_pages_' + doc.post.id + '').val()

        var found = false;
        var current_doc = filterByProperty(that.docs, 'id', doc.post.id);

        // console.log(current_doc)
        include_ids.forEach(function (item) {
          var page_exist = filterByProperty(that.docs, 'include_page_id', item, true)

          if (0 != page_exist.length) {


            for (var i = 0; i < page_exist.length; i++) {


              if (page_exist[i] != current_doc[0]) {
                found = true;
                break;
              }
            }

            if (found) {
              return;
            }
          }

        })


        if (found) {
          Swal.fire({
            title: 'Error! ',
            text: 'A page already included in antoher doc!',
            icon: 'error',
            customClass: 'ultd__alert ultd__alert_error'
          });
          return;
        }
        // for (var i = 0; i < include_ids.length; i++) {
        //   var page_exist = filterByProperty(that.docs, 'include_page_id', include_ids.i)
        //   console.log(include_ids);
        //   if (0 != page_exist.length) {
        //     return;
        //   }
        // }
        wp.ajax.send({
          data: {
            action: 'ultd__save_include_exclude',
            include_ids: include_ids,
            exclude_ids: exclude_ids,
            post_id: doc.post.id,
            order: doc.child.length,
            _wpnonce: UltimateDoc.nonce,
          },
          success: function (res) {
            // var articles = jQuery(parentEvent.target).parents('.ultd--row-actions')
            //   .siblings('a').find('.ultd--title')
            // articles.text(updatedTitle);
            // console.log(res);
            doc.post.include_pages = res.include_pages;
            doc.post.exclude_pages = res.exclude_pages;

            var success_icon = '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 13L11.6667 15.6667L17 10.3333M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

            Swal.fire({
              title: success_icon + 'Successfully Updated!',
              text: 'You can always change this again if needed.',              
              customClass: 'ultd__alert ultd__alert_success',
              confirmButtonText: 'Go Back',
            });
            // if (articles.hasClass('collapsed')) {
            //   articles.removeClass('collapsed');
            // }
          },
          error: function (error) {
            console.log(error);
          },
        });


      });
    },


    removeArticle: function (article, articles) {
      var self = this;
      var delete_icon = '<svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M21.3333 6.33333L20.1769 22.5233C20.0772 23.9188 18.916 25 17.517 25H6.48296C5.08393 25 3.92275 23.9188 3.82307 22.5233L2.66665 6.33333M9.33331 11.6667V19.6667M14.6666 11.6667V19.6667M16 6.33333V2.33333C16 1.59695 15.403 1 14.6666 1H9.33331C8.59693 1 7.99998 1.59695 7.99998 2.33333V6.33333M1.33331 6.33333H22.6666" stroke="#A1A1AA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      Swal.fire({
        title: delete_icon + UltimateDoc.delConfirm,
        text: UltimateDoc.delConfirmTxt,
        showCancelButton: true,
        confirmButtonColor: '#F54343',
        confirmButtonText: UltimateDoc.delConfirmBtn,
        cancelButtonText: UltimateDoc.cancelBtn,
        customClass: 'ultd__alert ultd__alert_delete'
      }).then(function (action) {
        if (action.isConfirmed) {
          self.removePost(article, articles);
        }
      });
    },

    removePost: function (index, items, message) {
      message = message || 'This post has been deleted';

      wp.ajax.send({
        data: {
          action: 'ultd__remove_doc',
          id: items[index].post.id,
          _wpnonce: UltimateDoc.nonce,
        },
        success: function () {
          Vue.delete(items, index);
          var success_icon = '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 13L11.6667 15.6667L17 10.3333M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

            Swal.fire({
              title: success_icon + 'Successfully Deleted!',
              // text: 'You can always change this again if needed.',              
              customClass: 'ultd__alert ultd__alert_success',
              confirmButtonText: 'Go Back',
            });
        },
        error: function (error) {
          alert(error);
        },
      });
    },

    toggleCollapse: function (event) {
      jQuery(event.target).siblings('ul.articles').slideToggle().toggleClass('collapsed').parent('li').siblings('li').children('ul.articles').slideUp();
    },
    actionMenu: function (event) {

      jQuery('span.ultd--row-actions li.active').removeClass('active');
      jQuery(event.path[0]).parent('li').toggleClass('active');
      jQuery(event.path[0]).parent().parent('li').toggleClass('active');

    },
    onClickOutside() {
      jQuery('span.ultd--row-actions li.active').removeClass('active');

    },
  },
});



insertShortcode = function (name) {
  var win = window.dialogArguments || opener || parent || top;
  var shortcode = '[testcode name=' + name + ']';
  win.send_to_editor(shortcode);
}

jQuery(document).ready(function ($) {
  $('#insert_shortcode').bind('click', function () {
    var name = $('#name').val();
    insertShortcode(name);
  });



  var selectedval = $('#ia_show_all_doc');
  if (selectedval.is(':checked')) {
    console.log('ok')
    $('.ultd--ia-select-doc').hide();
  } else {
    $('.ultd--ia-select-doc').show();

  }
  $('#ia_show_all_doc').on('change', function () {
    var selectedval = $(this);
    if (selectedval.is(':checked')) {
      $('.ultd--ia-select-doc').hide();
    } else {
      $('.ultd--ia-select-doc').show();

    }

  });


  var selectedval = $('#ia_doc_show_type').val();
  if ('condition' == selectedval) {
    $('.ultd--setting-info').show();
    $('.ia-show-type-normal').hide();
    console.log('ok');
  } else {
    $('.ultd--setting-info').hide();
    $('.ia-show-type-normal').show();
  }


  $('#ia_doc_show_type').on('change', function () {
    var selectedval = $(this).val();
    if ('condition' == selectedval) {
      $('.ultd--setting-info').show();
      $('.ia-show-type-normal').hide();
    } else {
      $('.ultd--setting-info').hide();
      $('.ia-show-type-normal').show();
    }
  });


  // var limen = jQuery('.ultd--row-actions li .toggler');
  // $(document).on('click', '.ultd--row-actions li .toggler', function (e) {
  //   limen.parent('li.active').removeClass('active');


  //   jQuery(this).parent('li').toggleClass('active');
  // })

  // jQuery('body').on('click', function () {
  //   limen.parent('li.active').removeClass('active');
  // })

});

function filterByProperty(array, prop, value, third_level = false) {
  var filtered = [];
  for (var i = 0; i < array.length; i++) {

    var obj = array[i];

    for (var key in obj) {
      if (typeof (obj[key] == "object")) {
        var item = obj[key];


        if (third_level && typeof (item[prop] == 'object')) {

          for (var keyy in item[prop]) {


            var itemm = item[prop][keyy];

            if (itemm == value) {
              filtered.push(item);
            }

          }
        } else if (item[prop] == value) {
          filtered.push(item);
        }


      }
    }

  }

  return filtered;

}