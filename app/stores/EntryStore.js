import EntryActions from '../actions/EntryActions';

/**
 * Re-usable store for entry-related data (users, lessons, groups etc.).
 */
class EntryStore {
    /**
     * Initializes empty properties used by entries.
     */
    constructor() {
        this.bindActions(EntryActions);

        this.entry = {};
        this.list = [];
        this.filters = {};
        this.sorters = {};
        this.config = {};
        this.isUpdating = false;
        this.isCreating = false;
        this.isRequesting = false;
    }

    /**
     * Entry received handler.
     *
     * @public
     * @param {Object} entry Entry received from the API
     */
    onReceived(entry) {
        this.entry = entry;
    }

    /**
     * Entry created handler.
     *
     * @public
     * @param {Object} entry Entry received from the API
     */
    onCreated(entry) {
        this.list.unshift(entry);
    }

    /**
     * Entry updated handler
     *
     * @public
     * @param {Object} updatedEntry Updated entry received from the API
     */
    onUpdated(updatedEntry) {
        this._onUpdated(updatedEntry);
        toastr.success('Info veiksmīgi atjaunināta');
    }

    /**
     * Entry received handler.
     *
     * Skips toastr message.
     *
     * @public
     * @param updatedEntry {Object} Updated entry
     */
    onSilentUpdated(updatedEntry) {
        this._onUpdated(updatedEntry);
    }

    /**
     * Entry deleted handler.
     *
     * @public
     * @param {Object} deletedEntry Deleted entry
     */
    onDeleted(deletedEntry) {
        this.list.some((entry, index) => {
            if (entry._id === deletedEntry._id) {
                this.list.splice(index, 1);

                return true;
            }
        });

        toastr.success('Izdzēšana notikusi veiksmīgi');
    }

    /**
     * Entry list received handler.
     *
     * @public
     * @param {Object[]} list Entry list
     */
    onListReceived(list) {
        this.list = list;
    }

    /**
     * Sets the updateable entry.
     *
     * @public
     * @param {Object} updatable Entry being updated
     */
    onSetUpdatable(updatable) {
        this.updatable = updatable;
    }

    /**
     * Sets the filters used by the store.
     *
     * @public
     * @param {Object} filters Entry filters
     */
    onSetFilters(filters) {
        this.filters = filters;
    }

    /**
     * Sets the sorters used by the store.
     *
     * @public
     * @param {Object} sorters Entry sorters
     */
    onSetSorters(sorters) {
        this.sorters = sorters;
    }

    /**
     * Sets the config (e.g. limit for entry list) used by the store.
     *
     * @public
     * @param {Object} config Entry config
     */
    onSetConfig(config) {
        this.config = config;
    }

    /**
     * Sets the is updating flag indicating if an entry is being updated or not.
     *
     * @public
     * @param {boolean} isUpdating Flag showing if an entry is being updated
     */
    onSetIsUpdating(isUpdating) {
        this.isUpdating = isUpdating;
    }

    /**
     * Sets the is creating flag indicating if an entry is being created or not.
     *
     * @public
     * @param {boolean} isCreating Flag showing if an entry is being created
     */
    onSetIsCreating(isCreating) {
        this.isCreating = isCreating;
    }

    /**
     * Sets the is requesting flag a reqeust is in progress or not.
     *
     * @public
     * @param {boolean} isRequesting Flag showing if a reqeust is in progress
     */
    onSetIsRequesting(isRequesting) {
        this.isRequesting = isRequesting;
    }

    /**
     * Handler for conflicts (status 409) in the API.
     */
    onUpdateConflict() {
        toastr.error('Resurss jau eksistē');
    }

    /**
     * Checks if the updated entry is in the list of existing entries and adds it if it is
     *
     * Also checks if the entry is the current entry and updates it if yes.
     *
     * @private
     * @param updatedEntry
     */
    _onUpdated(updatedEntry) {
        this.list.some((entry, index) => {
            if (entry._id === updatedEntry._id) {
                this.list[index] = updatedEntry;

                return true;
            }
        });

        if (this.entry._id === updatedEntry._id) {
            this.entry = updatedEntry;
        }
    }
}

export default EntryStore;
