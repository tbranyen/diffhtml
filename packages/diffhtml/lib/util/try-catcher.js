/**
 * Swallows any exceptions from the provided callback.
 *
 * @param  {Function} callback
 */
export default function tryCatcher(callback) {
    try {
        callback();
    } catch (unhandledException) {}
}
