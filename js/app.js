(function($) {

    function populateList(arrObj) {
        var arrLength = arrObj.length,
            ulEl = $('<ul>'),
            ulParent = $('#searchContainer');

        for (var i = 0; i < arrLength; i++) {
            var iEl = $('<i>').addClass('icon_sprites icon_' + (i + 1)),
                pEl1 = $('<p>').addClass('title').text(arrObj[i].title),
                pEl2 = $('<p>').addClass('address').text(arrObj[i].address + ', ' + arrObj[i].city);

            var liEl = $('<li>').append(iEl).append(pEl1).append(pEl2);
            ulEl.append(liEl);
        }

        ulParent.append(ulEl);
    }

    $(document).ready(function($) {

        var mapEle = $('#map-canvas')[0];
        MapHelper.init(mapEle);


        $('#searchForm').submit(function() {

            var zip = $('#inputZip').val(),
                radius = $('#selectRadius').val(),
                query = $('#inputSearch').val(),
                storeKey = zip + '|' + radius + '|' + query;

            var recentSearch = Util.getRecentSearch(storeKey);

            if (recentSearch) {
                $('#searchContainer').empty();
                MapHelper.clearMarkers();
                var recentSearchObj = JSON.parse(recentSearch);
                populateList(recentSearchObj);
                MapHelper.setMarkers(recentSearchObj);
                return false;
            }


            YQLHelper.queryYQL(zip, radius, query, function(response) {

                $('#searchContainer').empty();
                MapHelper.clearMarkers();

                var resultArray = response.query.results.Result;
                var reducedObj = [];

                var arrLength = resultArray.length;

                for (var i = 0; i < arrLength; i++) {
                    var biz = resultArray[i];
                    var myObj = {
                        title: biz.Title,
                        address: biz.Address,
                        city: biz.City,
                        state: biz.State,
                        lat: biz.Latitude,
                        lng: biz.Longitude,
                        icon: 'images/markers/icon_' + (i + 1) + '.png'
                    };
                    reducedObj.push(myObj);
                    //console.log(myObj);
                }

                populateList(reducedObj);
                MapHelper.setMarkers(reducedObj);
                Util.setRecentSearch(storeKey, JSON.stringify(reducedObj));

            }, function(jqXHR, textStatus, error) {
                console.log(error);
            });

            return false;
        });

    });

})(jQuery);
