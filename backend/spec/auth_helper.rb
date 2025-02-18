module AuthHelper
  def auth_headers(user)
    token = user.create_new_auth_token
    {
      'uid' => token['uid'],
      'client' => token['client'],
      'access-token' => token['access-token']
    }
  end
end

RSpec.configure do |config|
  config.include AuthHelper, type: :request
  config.extend AuthHelper, type: :request
end
