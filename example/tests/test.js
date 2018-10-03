describe('CbtTest', function() {
  it('should pass"', function() {
    document.body.innerHTML = window.__html__['tests/index.html'];
    
    var value = document.getElementById('custom-div').innerText;
    expect(value).toBe('test value');
  });
  it('should fail"', function() {
    document.body.innerHTML = window.__html__['tests/index.html'];
    
    var value = document.getElementById('custom-div').innerText;
    expect(value).toBe('wrong value');
  });
});