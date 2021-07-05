import Vue from 'vue';
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate';
import * as originalRules from 'vee-validate/dist/rules';
// import ja from 'vee-validate/dist/locale/ja.json';

// 全てのルールをインポート
let rule;
for (rule in originalRules) {
  extend(rule, {
    ...originalRules[rule],
  });
}

const ja = {
  "code": "ja",
  "messages": {
    "alpha": "{_field_}はアルファベットのみ使用できます",
    "alpha_num": "{_field_}は英数字のみ使用できます",
    "alpha_dash": "{_field_}は英数字とハイフン、アンダースコアのみ使用できます",
    "alpha_spaces": "{_field_}はアルファベットと空白のみ使用できます",
    "confirmed": "{_field_}が一致しません",
    "email": "{_field_}は有効なメールアドレスではありません",
    "max": "{_field_}は{length}文字以内にしてください",
    "max_value": "{_field_}は{max}以下でなければなりません",
    "min": "{_field_}は{length}文字以上でなければなりません",
    "min_value": "{_field_}は{min}以上でなければなりません",
    "required": "{_field_}は必須項目です",
  }
};
localize('ja', ja)

// 日本語に設定
localize('ja', ja);

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);