twic.db = ( function() {

	var
		VERSION = 1,
		NAME = 'twic',
		db;

	function onUpgradeNeeded(event) {
		var
			db = event.target.result,
			store;

		if (event.newVersion === 1) {
			store = db.createObjectStore(twic.User.collectionName, { keyPath: 'id' } );
			store.createIndex('nick', 'nick', { unique: true });
			store.createIndex('updateTime', 'updateTime', { unique: false });

			store = db.createObjectStore(twic.Tweet.collectionName, { keyPath: 'id' } );
			store.createIndex('id', ['createdStamp', 'id'], { unique: true });
			store.createIndex('updateTime', 'updateTime', { unique: false });
		}
	}

	function getDB(callback) {
		var
			request;

		if (db) {
			callback(db);
			return;
		}

		request = indexedDB.open(NAME, VERSION);
		request.onupgradeneeded = onUpgradeNeeded;
		request.onsuccess = function(event) {
			db = request.result;

			callback(db);
		};
	}

	function getObjectStore(collection, mode, callback) {
		getDB( function(db) {
			callback(
				db.transaction(collection, mode).objectStore(collection)
			);
		} );
	}

	function putToCollection(collection, object, callback) {
		getObjectStore(collection, 'readwrite', function(collection) {
			var
				request = collection.put(object);

			request.onerror = function(event) {
				callback(request.result); // ?
			};

			request.onsuccess = function(event) {
				callback();
			};
		} );
	}

	function getFromCollection(collection, id, callback) {
		getObjectStore(collection, 'readonly', function(collection) {
			var
				request = collection.get(id);

			request.onerror = function(event) {
				callback(request.result);
			};

			request.onsuccess = function(event) {
				callback(null, request.result);
			};
		} );
	}

	return {
		name: NAME,
		put: putToCollection,
		get: getFromCollection
	};

}() );
