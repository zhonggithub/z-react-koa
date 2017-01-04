export default {
  async create(ctx) {
    const groupId = ctx.params.groupId;
    const body = ctx.request.body;
    const tagInfo = {
      groupId,
      tags: body.sourceTags,
      tagType: 'sourceTag',
    };
    const ret = await ctx.invoke('wechat-callback-reply-service', 'tag.update', tagInfo);
    if (ret.code !== 0) {
      ctx.throw(ret, 500);
      return;
    }
    delete body.sourceTags;
    const info = {
      groupId,
      ...body,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'reply.source.create', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 201;
  },

  async update(ctx) {
    const groupId = ctx.params.groupId;
    const id = ctx.params.materialId;
    const info = {
      ...ctx.request.body,
      groupId,
      id,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'reply.source.update', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async updateStatus(ctx) {
    const id = ctx.params.materialId;
    const info = {
      id,
      ...ctx.request.body,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'reply.source.update.status', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async list(ctx) {
    const groupId = ctx.params.groupId;
    const query = {
      ...ctx.query,
      groupId,
      page: ctx.query.page ? Number(ctx.query.page) : 1,
      limit: ctx.query.limit ? Number(ctx.query.limit) : 10,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'reply.source.query', query);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async delete(ctx) {
    const id = ctx.params.materialId;
    const info = {
      id,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'reply.source.delete', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.status = 204;
  },

  async retrieve(ctx) {
    const id = ctx.params.materialId;
    const retData = await ctx.invoke('wechat-callback-reply-service', 'reply.source.get', { id });
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async batch(ctx) {
    const data = ctx.request.body;
    const opts = data.opts;
    const retInfo = [];
    await Promise.all(opts.map(async (item) => {
      const retData = await ctx.invoke('wechat-callback-reply-service', item.method, item.data);
      if (retData.code !== 0) {
        retInfo.push({
          opt: item,
          error: retData,
        });
      }
    }));
    ctx.body = {
      code: retInfo.length === 0 ? 0 : 'error',
      message: retInfo.length === 0 ? 'success' : 'error',
      data: retInfo,
    };
    ctx.status = 200;
  },

  async tagUpdate(ctx) {
    const groupId = ctx.params.groupId;
    const info = {
      ...ctx.request.body,
      groupId,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'tag.update', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async tagGet(ctx) {
    const groupId = ctx.params.groupId;
    const info = {
      ...ctx.query,
      groupId,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'tag.get', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async replyList(ctx) {
    const groupId = ctx.params.groupId;
    const info = {
      ...ctx.query,
      groupId,
      page: ctx.query.page ? Number(ctx.query.page) : 1,
      limit: ctx.query.limit ? Number(ctx.query.limit) : 10,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'reply.query', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    // 获取素材数据
    await Promise.all(retData.data.docs.map(async (item) => {
      const retInfo = await ctx.invoke('wechat-callback-reply-service', 'reply.source.get', { id: item.sourceId });
      if (retInfo.code === 0) {
        item.replySource = retInfo.data;
      }
    }));

    ctx.body = retData;
    ctx.status = 200;
  },

  async replySet(ctx) {
    const groupId = ctx.params.groupId;
    const info = {
      ...ctx.request.body,
      groupId,
    };
    if (info.isContent) { // 是创建关键字回复
      const tagInfo = {
        groupId,
        tags: info.sourceTags,
        tagType: 'contentTag',
      };
      const ret = await ctx.invoke('wechat-callback-reply-service', 'tag.update', tagInfo);
      if (ret.code !== 0) {
        ctx.throw(ret, 500);
        return;
      }

      const contentInfo = {
        groupId,
        keys: info.sourceContent,
      };
      const contentRet = await ctx.invoke('wechat-callback-reply-service', 'content.update', contentInfo);
      if (contentRet.code !== 0) {
        ctx.throw(contentRet, 500);
        return;
      }

      delete info.sourceTags;
      delete info.sourceContent;
      delete info.isContent;
    }
    const retData = await ctx.invoke('wechat-callback-reply-service', 'reply.set', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async replyGet(ctx) {
    const id = ctx.params.replyId;
    const info = {
      id,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'reply.get', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async replyUpdate(ctx) {
    const groupId = ctx.params.groupId;
    const id = ctx.params.replyId;
    const info = {
      ...ctx.request.body,
      groupId,
      id,
    };

    if (info.isContent) { // 是更新关键字回复
      const tagInfo = {
        groupId,
        tags: info.sourceTags,
        tagType: 'contentTag',
      };
      const ret = await ctx.invoke('wechat-callback-reply-service', 'tag.update', tagInfo);
      if (ret.code !== 0) {
        ctx.throw(ret, 500);
        return;
      }

      const contentInfo = {
        groupId,
        keys: info.sourceContent,
      };
      const contentRet = await ctx.invoke('wechat-callback-reply-service', 'content.update', contentInfo);
      if (contentRet.code !== 0) {
        ctx.throw(contentRet, 500);
        return;
      }

      delete info.sourceTags;
      delete info.sourceContent;
      delete info.isContent;
    }

    const retData = await ctx.invoke('wechat-callback-reply-service', 'reply.update', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async replyUpdateStatus(ctx) {
    const id = ctx.params.replyId;
    const info = {
      ...ctx.request.body,
      id,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'reply.update.status', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async replyDelete(ctx) {
    const id = ctx.params.replyId;
    const info = {
      id,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'reply.delete', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.status = 204;
  },

  async contentGet(ctx) {
    const groupId = ctx.params.groupId;
    const info = {
      groupId,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'content.get', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async contentUpdate(ctx) {
    const groupId = ctx.params.groupId;
    const info = {
      groupId,
      ...ctx.request.body,
    };
    const retData = await ctx.invoke('wechat-callback-reply-service', 'content.update', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 201;
  },
};
