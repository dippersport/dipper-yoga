// Define globally immediately
function useProofNotification() {
    if (window.showNextOrder) {
        window.showNextOrder();
    } else {
        console.error("showNextOrder function is not defined yet.");
    }
}
$(document).ready(function() {
    var currentIndex = 0;
    function timeSince(date) {
		var now = new Date();
		var datePast = new Date(date);
		var seconds = Math.floor((now - datePast) / 1000);
		var interval = seconds / 86400; // Days
		if (interval >= 1) {
			return Math.floor(interval) + " day" + (Math.floor(interval) !== 1 ? "s" : "") + " ago";
		}
		interval = seconds / 3600; // Hours
		if (interval >= 1) {
			return Math.floor(interval) + " hour" + (Math.floor(interval) !== 1 ? "s" : "") + " ago";
		}
		interval = Math.max(Math.floor(seconds / 60), 1); // Minutes
		return interval + " minute" + (interval !== 1 ? "s" : "") + " ago";
	}

    function toTitleCase(str) {
		return str.toLowerCase().replace(/\b\w/g, function(char) {
			return char.toUpperCase();
		});
	}

    var currentIndex = 0; // Initialize currentIndex outside the function

	function updateContent() {
		if (currentIndex >= orders.length) currentIndex = 0; // Reset index if over
		var order = orders[currentIndex++]; 
		var productInfo = productData[order.lineItemData.itemNo];
		var city = order.customerContactInfo.find(info => info.field === 'city')?.value;
		var state = order.customerContactInfo.find(info => info.field === 'shippingState')?.value;
		var country = order.customerContactInfo.find(info => info.field === 'shippingCountry')?.value.toUpperCase() || 'CA';

		// Ensure state is always in uppercase when it is displayed
		state = state ? state.toUpperCase() : null;

		// Construct location string, handling city, state, and country appropriately
		var location;
		if (city && state) {
			location = toTitleCase(city) + ', ' + state; // State is always uppercase
		} else if (city) {
			location = toTitleCase(city) + ', ' + country; // City and country
		} else if (state) {
			location = state; // Only state in uppercase
		} else {
			location = country; // Only country code when both city and state are missing
		}

		var html = '<div class="useproof-wrap"><div class="useproof-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.597 17.954l-4.591-4.55-4.555 4.596-1.405-1.405 4.547-4.592-4.593-4.552 1.405-1.405 4.588 4.543 4.545-4.589 1.416 1.403-4.546 4.587 4.592 4.548-1.403 1.416z"></path></svg></div><div class="useproof-image">' +
				   '<img src="' + productInfo.image + '" alt="Product Image" class="product-image">' +
				   '</div>' +
				   '<div>' +
				   '<span class="useproof-info">' + toTitleCase(order.firstName) + ' from ' + location + '</span>' +
				   '<span class="useproof-product">Just purchased ' + productInfo.title + '</span>' +
				   '<span class="useproof-time">' + timeSince(new Date(order.transactionTime)) + '</span>' +
				   '</div></div>';

		$('#notification-widget').html(html).slideDown(300).delay(7000).slideUp(300, function() {
			setTimeout(showNextOrder, 20000); // Wait 20 seconds before starting the next slide down
		});
	}

    window.showNextOrder = function() {
        updateContent();
    };

    window.useProofNotification = function() {
        showNextOrder();
    };
		
    $(document).on('click', '.useproof-close', function() {
        $('#notification-widget').stop(true).hide(); // Instantly hides the widget when closed
    });

    
});