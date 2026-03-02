import { motion } from "framer-motion";
import { Heart, MessageCircle, MapPin } from "lucide-react";

interface PostCardProps {
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  placeName?: string;
  likes: number;
  comments: number;
  timeAgo: string;
  index?: number;
}

const PostCard = ({
  userName,
  userAvatar,
  content,
  image,
  placeName,
  likes,
  comments,
  timeAgo,
  index = 0,
}: PostCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-xl shadow-card overflow-hidden"
    >
      {/* Image */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={`Recuerdo de ${userName}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* User info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-warm flex items-center justify-center text-primary-foreground text-sm font-bold">
            {userAvatar}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{timeAgo}</span>
              {placeName && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" />
                    {placeName}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-foreground leading-relaxed mb-3">{content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-medium">{likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">{comments}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
