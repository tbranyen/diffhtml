module.exports = script => {
  return String(script)
    .replace(/\<script/g, '\\<script')
    .replace(/\<style/g, '\\<style')
    .replace(/\<\//g, '\\<\\/')
    .replace(/__DIFFHTML__/g, '\\_\\_DIFFHTML\\_\\_');
};
