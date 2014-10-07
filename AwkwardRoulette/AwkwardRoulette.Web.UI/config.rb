# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
#http_path = "/"
#images_dir = "img"
#javascripts_dir = "js"
#css_dir = "css"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
#relative_assets = true
project_type = :stand_alone

# To disable debugging comments that display the original location of your selectors. Uncomment:
#line_comments = true


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass wp-content/themes/child-theme/sass scss && rm -rf sass && mv scss sass

preferred_syntax = :scss
http_path = '/'
css_dir = 'css'
sass_dir = 'css'
images_dir = 'img'
javascripts_dir = 'js'
relative_assets = true
line_comments = true
sourcemap = true
# output_style = :compressed

module Compass::SassExtensions::Functions::Sprites
  def sprite_url(map)
    verify_map(map, "sprite-url")
    map.generate
    generated_image_url(Sass::Script::String.new(map.name_and_hash))
  end
end

module Compass::SassExtensions::Sprites::SpriteMethods
  def name_and_hash
    "sprite-#{path}.png"
  end

  def cleanup_old_sprites
    Dir[File.join(::Compass.configuration.generated_images_path, "sprite-#{path}.png")].each do |file|
      log :remove, file
      FileUtils.rm file
      ::Compass.configuration.run_sprite_removed(file)
    end
  end
end

module Compass
  class << SpriteImporter
    def find_all_sprite_map_files(path)
      glob = "sprite-*{#{self::VALID_EXTENSIONS.join(",")}}"
      Dir.glob(File.join(path, "**", glob))
    end
  end
end