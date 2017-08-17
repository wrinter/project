<template>
    <div class="header">
        <div class="NavMain">
            <img src="static/common/com/logo.png" alt="" class="NavLogo">
            <a href="#" class="RegBtn">注册</a>
            <a href="#" class="LoginBtn">登录</a>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">

</script>
<style>
    @media screen and (max-width:1366px){
        .NavMain{width: 900px;}
    }
    @media screen and (min-width:1366px){
        .NavMain{width: 1000px;}
    }
    @media screen and (min-width:1600px){
        .NavMain{width: 1200px;}
    }
    .header{width: 100%;  overflow: hidden;  min-width: 1000px;  background: white;  box-sizing: border-box;  height: 92px;  border-bottom: 2px solid #00ce9f;}
    .NavLogo{float: left;}
    .NavMain{overflow: hidden;margin: 0 auto;height: 100%;}
    .RegBtn{float: right;color: #323232;font-size: 16px;line-height: 31px;margin-top: 30px;box-sizing: border-box;border: 1px solid #fff;width: 102px;text-align: center}
    .LoginBtn{ box-sizing: border-box;border: 1px solid #fff;float: right;width: 102px;height: 31px;line-height: 29px;font-size: 16px;text-align: center;margin-top: 30px;color: #323232;}
    .LoginBtn:hover{color: #00ce9f;border-radius: 16px; box-sizing: border-box;border: 1px solid #00ce9f; }
    .RegBtn:hover{color: #00ce9f;border-radius: 16px; box-sizing: border-box;border: 1px solid #00ce9f; }
</style>
