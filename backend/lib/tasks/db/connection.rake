namespace :db do
  namespace :connection do
    desc "Close all DB connections"
    task close: :environment do
      db_name = ActiveRecord::Base.connection.current_database
      ActiveRecord::Base.connection.execute(ActiveRecord::Base.sanitize_sql_array([ <<~SQL, db_name ]))
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = '%s' AND pid <> pg_backend_pid();
      SQL
    end
  end
end
