// components/CommunityFeedbackCard.tsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { ThumbsUp, MessageSquare, Star } from "lucide-react";
import { useFeatureFlags } from "@context/FeatureFlagContext";
import { FeatureFlagKeys } from "@utils/featureFlags";

interface CommunityFeedbackCardProps {
  onLeaveReview: () => void;
  onMakeSuggestion: () => void;
}

const CommunityFeedbackCard: React.FC<CommunityFeedbackCardProps> = ({
  onLeaveReview,
  onMakeSuggestion,
}) => {
  const { isFeatureEnabled } = useFeatureFlags();

  // If the CommunityFeedbackCard feature flag is disabled, don't render the card
  if (!isFeatureEnabled(FeatureFlagKeys.ENABLE_COMMUNITYFEEDBACK_CARD)) {
    return null;
  }

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Star className="mr-2 h-5 w-5 text-yellow-500" />
          Community Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-zinc-300">
            Help us improve Imperfect Gamers! Share your thoughts or
            suggestions.
          </p>
          <div className="flex space-x-2">
            {isFeatureEnabled(
              FeatureFlagKeys.ENABLE_COMMUNITYFEEDBACK_LEAVE_REVIEW
            ) && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={onLeaveReview}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Leave a Review
              </Button>
            )}
            {isFeatureEnabled(
              FeatureFlagKeys.ENABLE_COMMUNITYFEEDBACK_MAKE_SUGGESTION
            ) && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={onMakeSuggestion}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Make a Suggestion
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityFeedbackCard;
