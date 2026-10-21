import { HTTP_STATUS } from '../constants/http.constants.js';
import { SUCCESS_MESSAGES } from '../constants/messages.constants.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class ChatController {
  /**
   * @param {import("../service/chatService.js").ChatService} chatService
   */

  constructor(chatService) {
    this.chatService = chatService;
  }

  reviseProject = async (req, res) => {
    const { prompt } = req.validatedBody;
    const projectId = req.validatedParams.id;
    const userId = req.user.userId;

    const revisionResult = await this.chatService.revise({
      prompt,
      projectId,
      userId,
    });

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGES.PROJECT_REVISION_SUCCESS,
      { revisionResult }
    );
  };
}
